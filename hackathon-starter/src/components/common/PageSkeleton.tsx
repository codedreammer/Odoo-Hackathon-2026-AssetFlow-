"use client";

export function PageSkeleton({ variant = "default" }: { variant?: "default" | "table" | "card" | "dashboard" }) {
  if (variant === "table") {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="h-10 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="px-4 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-l" />
                  <th className="px-4 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                  <th className="px-4 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                  <th className="px-4 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                  <th className="px-4 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-r" />
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="px-4 py-4 animate-pulse bg-zinc-100 dark:bg-zinc-800/50 rounded-l" />
                    <td className="px-4 py-4 animate-pulse bg-zinc-100 dark:bg-zinc-800/50" />
                    <td className="px-4 py-4 animate-pulse bg-zinc-100 dark:bg-zinc-800/50" />
                    <td className="px-4 py-4 animate-pulse bg-zinc-100 dark:bg-zinc-800/50" />
                    <td className="px-4 py-4 animate-pulse bg-zinc-100 dark:bg-zinc-800/50 rounded-r" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="h-4 w-24 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-8 w-32 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-96 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="h-4 w-20 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
              <div className="h-10 w-24 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="h-5 w-32 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
              <div className="h-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
      <div className="h-4 w-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-12 w-12 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-1/2 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}