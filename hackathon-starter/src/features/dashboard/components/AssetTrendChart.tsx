import type { AssetTrendPoint } from "../types";

const WIDTH = 900;
const HEIGHT = 260;
const LEFT = 40;
const RIGHT = 880;
const TOP = 20;
const BOTTOM = 220;
const MAX_VALUE = 240;
const GRID_VALUES = [0, 60, 120, 180, 240];

function toY(value: number) {
  return BOTTOM - (value / MAX_VALUE) * (BOTTOM - TOP);
}

function toPoints(values: number[]) {
  const step = (RIGHT - LEFT) / (values.length - 1);
  return values.map((v, i) => `${LEFT + i * step},${toY(v)}`).join(" ");
}

export function AssetTrendChart({ data }: { data: AssetTrendPoint[] }) {
  const months = data.map((d) => d.month);
  const active = data.map((d) => d.active);
  const maintenance = data.map((d) => d.maintenance);
  const step = (RIGHT - LEFT) / (months.length - 1);

  return (
    <div className="mb-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-neutral-900">Asset count over time</h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Active vs. in maintenance · {months[0]}–{months[months.length - 1]}
          </p>
        </div>
        <div className="flex gap-3.5 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <i className="h-0.5 w-2.5 rounded-full bg-[#3B63F5]" />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-0.5 w-2.5 rounded-full bg-[#D9A441]" />
            Maintenance
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[230px] w-full overflow-visible">
        <line x1={LEFT} y1={TOP} x2={LEFT} y2={BOTTOM} stroke="#E7E8EC" strokeWidth={1} />
        {GRID_VALUES.map((v) => (
          <line key={v} x1={LEFT} y1={toY(v)} x2={RIGHT} y2={toY(v)} stroke="#F0F1F4" strokeWidth={1} />
        ))}
        {GRID_VALUES.map((v) => (
          <text key={v} x={26} y={toY(v) + 4} textAnchor="end" fontSize={11} fill="#9CA1AC">
            {v}
          </text>
        ))}
        {months.map((m, i) => (
          <text key={m} x={LEFT + i * step} y={240} fontSize={11} fill="#9CA1AC">
            {m}
          </text>
        ))}
        <polyline
          points={toPoints(active)}
          fill="none"
          stroke="#3B63F5"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={toPoints(maintenance)}
          fill="none"
          stroke="#D9A441"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
