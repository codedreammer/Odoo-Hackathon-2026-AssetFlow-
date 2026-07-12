import type { AlertItem } from "../types";
import { AlertIcon } from "./icons";

export function AlertBanner({ alert }: { alert: AlertItem }) {
  if (!alert.items.length) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <AlertIcon className="h-[18px] w-[18px] shrink-0 text-amber-500" />
      <span>
        <b className="font-bold">{alert.count} items need attention</b>
        {" — "}
        {alert.items.map((item, i) => (
          <span key={item}>
            {i > 0 && <span className="opacity-50"> · </span>}
            {item}
          </span>
        ))}
      </span>
      <a className="ml-auto cursor-pointer whitespace-nowrap font-bold underline underline-offset-2">
        View all
      </a>
    </div>
  );
}
