import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  DashboardData,
  AlertItem,
  StatCard,
  DepartmentCount,
  CategoryCount,
  RecentAsset,
  MaintenanceTicket,
  AssetStatus,
  MaintenanceBadgeVariant,
  MaintenancePriority,
} from "../types";

export async function getDashboardData(): Promise<{ success: boolean; data: DashboardData | null; error: Error | null }> {
  try {
    const supabase = await createClient();

    // Dates for filtering
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Fetch all independent datasets in parallel using Promise.all
    const [
      userRes,
      overdueAllocsRes,
      criticalMaintRes,
      totalAssetsRes,
      totalDeptsRes,
      totalEmpsRes,
      allocatedAssetsRes,
      unassignedAssetsRes,
      openMaintRes,
      assetValuesRes,
      newAllocationsRes,
      overdueMaintRes,
      empsCreatedThisMonthRes,
      deptsRes,
      allocsRes,
      catsRes,
      assetsCatRes,
      dbRecentAssetsRes,
      dbMaintenanceRes,
    ] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from("asset_allocations")
        .select("expected_return_date, assets ( name, asset_tag )")
        .eq("status", "ACTIVE")
        .lt("expected_return_date", today),
      supabase
        .from("maintenance_requests")
        .select("priority, status, assets ( name )")
        .eq("priority", "Critical")
        .not("status", "in", '("RESOLVED","REJECTED")'),
      supabase.from("assets").select("*", { count: "exact", head: true }),
      supabase.from("departments").select("*", { count: "exact", head: true }).eq("status", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("assets").select("*", { count: "exact", head: true }).eq("status", "ALLOCATED"),
      supabase.from("assets").select("*", { count: "exact", head: true }).eq("status", "AVAILABLE"),
      supabase
        .from("maintenance_requests")
        .select("*", { count: "exact", head: true })
        .not("status", "in", '("RESOLVED","REJECTED")'),
      supabase.from("assets").select("acquisition_cost, created_at"),
      supabase
        .from("asset_allocations")
        .select("*", { count: "exact", head: true })
        .gte("allocated_at", oneWeekAgo.toISOString()),
      supabase
        .from("maintenance_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "PENDING")
        .lt("created_at", threeDaysAgo.toISOString()),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth),
      supabase.from("departments").select("id, name").eq("status", true),
      supabase.from("asset_allocations").select("department_id").eq("status", "ACTIVE"),
      supabase.from("asset_categories").select("id, name").eq("active", true),
      supabase.from("assets").select("category_id"),
      supabase
        .from("assets")
        .select(`
          id,
          asset_tag,
          name,
          status,
          acquisition_cost,
          created_at,
          asset_categories ( name ),
          asset_allocations (
            status,
            profiles (
              full_name
            )
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("maintenance_requests")
        .select(`
          id,
          priority,
          description,
          status,
          created_at,
          assets (
            name
          )
        `)
        .not("status", "in", '("RESOLVED","REJECTED")')
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    // 1. Process Greeting
    let full_name = "User";
    const user = userRes.data?.user;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (profile?.full_name) {
        full_name = profile.full_name;
      }
    }

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(now);

    const org = {
      name: "Acme Corporation",
      date: formattedDate,
      user: full_name,
    };

    // 2. Process Alert Banner
    const alertItems: string[] = [];
    if (overdueAllocsRes.data) {
      overdueAllocsRes.data.forEach((alloc: any) => {
        const assetName = alloc.assets?.name || "Asset";
        const assetTag = alloc.assets?.asset_tag || "Unknown";
        alertItems.push(`${assetTag} (${assetName}) is overdue`);
      });
    }
    if (criticalMaintRes.data) {
      criticalMaintRes.data.forEach((maint: any) => {
        const assetName = maint.assets?.name || "Asset";
        alertItems.push(`Critical maintenance for ${assetName}`);
      });
    }
    const alert: AlertItem = {
      count: alertItems.length,
      items: alertItems.slice(0, 3),
    };

    // 3. Process Stats Grid
    const totalAssets = totalAssetsRes.count || 0;
    const assetsCreatedThisMonth = assetValuesRes.data?.filter(a => a.created_at >= startOfMonth).length || 0;
    
    const allocatedAssets = allocatedAssetsRes.count || 0;
    const newAllocationsThisWeek = newAllocationsRes.count || 0;

    const openMaintenance = openMaintRes.count || 0;
    const overdueMaintenance = overdueMaintRes.count || 0;

    const totalValue = assetValuesRes.data?.reduce((sum, a) => sum + (Number(a.acquisition_cost) || 0), 0) || 0;
    let formattedValue = `$${totalValue.toLocaleString()}`;
    if (totalValue >= 1000) {
      formattedValue = `$${(totalValue / 1000).toFixed(1)}k`;
    }

    const newAssetsValue = assetValuesRes.data?.filter(a => a.created_at >= startOfMonth)
      .reduce((sum, a) => sum + (Number(a.acquisition_cost) || 0), 0) || 0;
    let formattedNewValue = `+$${newAssetsValue.toLocaleString()}`;
    if (newAssetsValue >= 1000) {
      formattedNewValue = `+$${(newAssetsValue / 1000).toFixed(1)}k this month`;
    } else {
      formattedNewValue = `+$${newAssetsValue} this month`;
    }

    const totalEmployees = totalEmpsRes.count || 0;
    const empsCreatedThisMonth = empsCreatedThisMonthRes.count || 0;

    const unassignedAssets = unassignedAssetsRes.count || 0;

    const stats: StatCard[] = [
      {
        label: "Total Assets",
        value: String(totalAssets),
        delta: `+${assetsCreatedThisMonth} this month`,
        trend: assetsCreatedThisMonth > 0 ? "up" : "neutral",
      },
      {
        label: "Allocated Assets",
        value: String(allocatedAssets),
        delta: `+${newAllocationsThisWeek} this week`,
        trend: newAllocationsThisWeek > 0 ? "up" : "neutral",
      },
      {
        label: "Open Maintenance",
        value: String(openMaintenance),
        delta: `${overdueMaintenance} overdue`,
        trend: openMaintenance > 5 ? "down" : "neutral",
      },
      {
        label: "Total Asset Value",
        value: formattedValue,
        delta: formattedNewValue,
        trend: newAssetsValue > 0 ? "up" : "neutral",
      },
      {
        label: "Total Employees",
        value: String(totalEmployees),
        delta: `+${empsCreatedThisMonth} this month`,
        trend: empsCreatedThisMonth > 0 ? "up" : "neutral",
      },
      {
        label: "Unassigned Assets",
        value: String(unassignedAssets),
        delta: "Available pool",
        trend: "neutral",
      },
    ];

    // 4. Process Trend
    // As per rules, historical trend calculations are not requested and we return empty array
    const trend: any[] = [];

    // 5. Process Department Breakdown
    const departmentsData: DepartmentCount[] = [];
    if (deptsRes.data && allocsRes.data) {
      const counts = new Map<string, number>();
      allocsRes.data.forEach((alloc: any) => {
        if (alloc.department_id) {
          counts.set(alloc.department_id, (counts.get(alloc.department_id) || 0) + 1);
        }
      });

      deptsRes.data.forEach((d: any) => {
        const count = counts.get(d.id) || 0;
        departmentsData.push({
          name: d.name,
          count,
        });
      });
    }
    departmentsData.sort((a, b) => b.count - a.count);
    const departments = departmentsData.slice(0, 5);

    // 6. Process Category Breakdown
    const categoriesData: CategoryCount[] = [];
    const colors = ["#3B63F5", "#D9A441", "#0F9D58", "#7C5CFC", "#9CA1AC"];
    if (catsRes.data && assetsCatRes.data) {
      const counts = new Map<string, number>();
      assetsCatRes.data.forEach((asset: any) => {
        if (asset.category_id) {
          counts.set(asset.category_id, (counts.get(asset.category_id) || 0) + 1);
        }
      });

      catsRes.data.forEach((c: any, index: number) => {
        const count = counts.get(c.id) || 0;
        categoriesData.push({
          name: c.name,
          count,
          color: colors[index % colors.length],
        });
      });
    }
    categoriesData.sort((a, b) => b.count - a.count);
    const categories = categoriesData.slice(0, 5);

    // 7. Process Recent Assets
    const recentAssets: RecentAsset[] = (dbRecentAssetsRes.data || []).map((asset: any) => {
      const activeAlloc = asset.asset_allocations?.find(
        (a: any) => a.status === "ACTIVE" || a.status === "OVERDUE"
      );
      const assigneeName = activeAlloc?.profiles?.full_name || null;
      const initials = assigneeName
        ? assigneeName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : null;

      let status: AssetStatus = "available";
      let statusLabel = "Available";
      if (asset.status === "ALLOCATED") {
        status = "active";
        statusLabel = "Active";
      } else if (asset.status === "UNDER_MAINTENANCE") {
        status = "maint";
        statusLabel = "In Maintenance";
      }

      const valueNum = Number(asset.acquisition_cost) || 0;
      const value = `$${valueNum.toLocaleString()}`;

      return {
        id: asset.asset_tag || asset.id,
        name: asset.name,
        category: asset.asset_categories?.name || "Unknown",
        assignee: assigneeName,
        initials,
        avatarColor: assigneeName ? "#3B63F5" : null,
        status,
        statusLabel,
        value,
      };
    });

    // 8. Process Maintenance Queue
    const maintenanceQueue: MaintenanceTicket[] = (dbMaintenanceRes.data || []).map((m: any) => {
      let badgeVariant: MaintenanceBadgeVariant = "open";
      let badge = "Open";

      if (m.status === "PENDING") {
        badgeVariant = "pending";
        badge = "Pending Approval";
      } else if (m.status === "IN_PROGRESS" || m.status === "TECHNICIAN_ASSIGNED") {
        badgeVariant = "progress";
        badge = "In Progress";
      }

      let priority: MaintenancePriority = "Medium";
      const rawPriority = String(m.priority).toLowerCase();
      if (rawPriority === "critical") priority = "Critical";
      else if (rawPriority === "high") priority = "High";
      else if (rawPriority === "low") priority = "Low";

      const createdDate = new Date(m.created_at);
      const dueDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const due = dueDate.toISOString().split("T")[0];

      return {
        asset: m.assets?.name || "Unknown Asset",
        type: m.description.length > 30 ? m.description.slice(0, 30) + "..." : m.description,
        badge,
        badgeVariant,
        priority,
        due,
      };
    });

    return {
      success: true,
      data: {
        org,
        alert,
        stats,
        trend,
        departments,
        categories,
        recentAssets,
        maintenanceQueue,
      },
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      error: err as Error,
    };
  }
}
