"use client";
import { useState } from "react";
import { Pencil, Trash2, Calendar, ChevronDown } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

const STATUS_CONFIG = {
  todo:        { label: "To Do",       color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
  in_progress: { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  completed:   { label: "Completed",   color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
};

const NEXT_STATUS = { todo: "in_progress", in_progress: "completed", completed: "todo" };

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [deleting, setDeleting] = useState(false);
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task.id);
  };

  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && task.status !== "completed" && !isToday(dueDate);
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <div
      className="group anim-fade-up rounded-2xl p-4 transition-all duration-200"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        opacity: deleting ? 0.4 : 1,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Top row: status badge + actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <button
          onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status])}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
          style={{
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.color}30`,
            fontFamily: "var(--font-body)",
          }}
          title="Click to advance status"
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
          {cfg.label}
          <ChevronDown size={10} style={{ opacity: 0.6 }} />
        </button>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
            style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
            title="Edit task"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
            title="Delete task"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold mb-1 leading-snug"
        style={{
          fontFamily: "var(--font-display)",
          color: task.status === "completed" ? "var(--text-muted)" : "var(--text)",
          textDecoration: task.status === "completed" ? "line-through" : "none",
        }}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {task.description}
        </p>
      )}

      {/* Due date */}
      {dueDate && (
        <div
          className="flex items-center gap-1.5 mt-3 text-xs"
          style={{
            color: isOverdue ? "#ef4444" : isDueToday ? "#f59e0b" : "var(--text-muted)",
          }}
        >
          <Calendar size={11} />
          {isOverdue ? "Overdue · " : isDueToday ? "Due today · " : ""}
          {format(dueDate, "MMM d, yyyy")}
        </div>
      )}
    </div>
  );
}
