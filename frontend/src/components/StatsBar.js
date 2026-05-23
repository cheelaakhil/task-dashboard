"use client";

export default function StatsBar({ tasks }) {
  const total      = tasks.length;
  const todo       = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed  = tasks.filter((t) => t.status === "completed").length;
  const pct        = total ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total",       value: total,      color: "var(--text-muted)" },
    { label: "To Do",       value: todo,       color: "#3b82f6" },
    { label: "In Progress", value: inProgress, color: "#f59e0b" },
    { label: "Completed",   value: completed,  color: "#10b981" },
  ];

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
        >
          Overview
        </span>
        <span
          className="text-xs font-bold"
          style={{ color: "#10b981", fontFamily: "var(--font-display)" }}
        >
          {pct}% done
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full mb-5 overflow-hidden"
        style={{ background: "var(--surface-2)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--accent), #06b6d4)",
          }}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: s.color, fontFamily: "var(--font-display)" }}
            >
              {s.value}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
