"use client";
import { useState, useMemo, useCallback } from "react";
import { Plus, Search, SlidersHorizontal, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import StatsBar from "@/components/StatsBar";

const STATUS_FILTERS = [
  { value: "all",        label: "All"         },
  { value: "todo",       label: "To Do"       },
  { value: "in_progress",label: "In Progress" },
  { value: "completed",  label: "Completed"   },
];

const SORT_OPTIONS = [
  { value: "created_at-desc", label: "Newest first"  },
  { value: "created_at-asc",  label: "Oldest first"  },
  { value: "due_date-asc",    label: "Due date ↑"    },
  { value: "due_date-desc",   label: "Due date ↓"    },
  { value: "title-asc",       label: "A → Z"         },
];

export default function Home() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch]             = useState("");
  const [sort, setSort]                 = useState("created_at-desc");
  const [modal, setModal]               = useState(null); // null | { mode: "create"|"edit", task? }

  const apiFilters = useMemo(() => {
    const [sort_by, order] = sort.split("-");
    return {
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(search && { search }),
      sort_by,
      order,
    };
  }, [statusFilter, search, sort]);

  const { tasks, loading, error, fetchTasks, createTask, updateTask, updateStatus, deleteTask } =
    useTasks(apiFilters);

  const handleSave = useCallback(
    async (data) => {
      if (modal?.task?.id) {
        await updateTask(modal.task.id, data);
      } else {
        await createTask(data);
      }
    },
    [modal, createTask, updateTask]
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(6,182,212,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
            >
              TaskFlow
            </p>
            <h1
              className="text-3xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              My Dashboard
            </h1>
          </div>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: "var(--accent)",
              color: "white",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* Stats */}
        <StatsBar tasks={tasks} />

        {/* Filters row */}
        <div className="space-y-3">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs px-2 py-0.5 rounded"
                style={{ color: "var(--text-muted)", background: "var(--surface-2)" }}
              >
                clear
              </button>
            )}
          </div>

          {/* Status tabs + sort */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-1.5">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: statusFilter === f.value ? "var(--accent)" : "var(--surface)",
                    color: statusFilter === f.value ? "white" : "var(--text-muted)",
                    border: `1px solid ${statusFilter === f.value ? "transparent" : "var(--border)"}`,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <SlidersHorizontal size={12} style={{ color: "var(--text-muted)" }} />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent outline-none text-xs cursor-pointer"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} style={{ background: "#1a1a24" }}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2
              size={28}
              className="animate-spin"
              style={{ color: "var(--accent)" }}
            />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Loading tasks...
            </span>
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-4 rounded-2xl"
            style={{ background: "var(--surface)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <AlertCircle size={32} style={{ color: "#ef4444" }} />
            <div className="text-center">
              <p className="font-semibold text-sm" style={{ color: "#ef4444" }}>
                Failed to load tasks
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {error}
              </p>
            </div>
            <button
              onClick={fetchTasks}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl gap-4"
            style={{ background: "var(--surface)", border: "1px dashed var(--border-hover)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "var(--surface-2)" }}
            >
              ✓
            </div>
            <div className="text-center">
              <p
                className="font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
              >
                {search || statusFilter !== "all" ? "No tasks match" : "No tasks yet"}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first task to get started"}
              </p>
            </div>
            {!search && statusFilter === "all" && (
              <button
                onClick={() => setModal({ mode: "create" })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <Plus size={15} /> Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task, i) => (
              <div key={task.id} style={{ animationDelay: `${i * 40}ms` }}>
                <TaskCard
                  task={task}
                  onEdit={(t) => setModal({ mode: "edit", task: t })}
                  onDelete={deleteTask}
                  onStatusChange={updateStatus}
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <p
          className="text-center text-xs pb-4"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {tasks.length > 0 && `${tasks.length} task${tasks.length !== 1 ? "s" : ""} · `}
          TaskFlow Dashboard
        </p>
      </div>

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal.task}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
