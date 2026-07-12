"use client";

import { Users, Building2, Laptop } from "lucide-react";

import { Card } from "@/components/ui/Card";

import { StatCard } from "../types";

interface Props {
  stats: StatCard[];
}

const icons = [
  Users,
  Building2,
  Laptop,
];

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">

      {stats.map((item, index) => {
        const Icon = icons[index];

        return (
          <Card
            key={item.title}
            className="rounded-2xl border border-zinc-200 p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-zinc-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-4xl font-bold tracking-tight">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  {item.description}
                </p>

              </div>

              <div className="rounded-xl bg-zinc-100 p-3">
                <Icon className="h-6 w-6 text-zinc-700" />
              </div>

            </div>
          </Card>
        );
      })}

    </div>
  );
}