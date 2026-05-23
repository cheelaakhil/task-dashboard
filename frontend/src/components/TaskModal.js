"use client";
import { useState, useEffect } from "react";
import { X, Calendar, AlignLeft, Tag } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "todo",        label: "To Do",       color: "#3b82f6" },
  { value: "in_progress", label: "In Progress",  color: "#f59e0b" },
  { value: "completed",   label: "Completed",    color: "#10b981" },
];

export default function TaskModal({ task, onClose, onSave }) {
  const isEdit = !!task?.id;
  const [form, setForm] = useState({
    title:       task?.title       || "",
    description: task?.description || "",
    status:      task?.status      || "todo",
    due_date:    task?.due_date    ? task.due_date.slice(0, 10) : "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.title.length > 200) errs.title = "Title too long";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({ ...form, due_date: form.due_date || null });
      onClose();
    } catch {}
    setSaving(false);
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg anim-fade-up"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-hover)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px" }}>
            {isEdit ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              <Tag size={11} /> Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="What needs to be done?"
              autoFocus
              className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm"
              style={{
                background: "var(--surface-2)",
                border: `1px solid ${errors.title ? "#ef4444" : "var(--border)"}`,
                color: "var(--text)",
                fontFamily: "var(--font-body)",
              }}
            />
            {errors.title && (
              <p className="text-xs" style={{ color: "#ef4444" }}>{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              <AlignLeft size={11} /> Description
            </label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all text-sm"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>

          {/* Status + Due Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-xs font-medium uppercase tracking-wider block"
                style={{ color: "var(--text-muted)" }}
              >
                Status
              </label>
              <div className="flex flex-col gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: opt.value }))}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left"
                    style={{
                      background: form.status === opt.value ? `${opt.color}20` : "var(--surface-2)",
                      border: `1px solid ${form.status === opt.value ? opt.color + "60" : "var(--border)"}`,
                      color: form.status === opt.value ? opt.color : "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: opt.color }}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                <Calendar size={11} /> Due Date
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={set("due_date")}
                className="w-full px-3 py-2 rounded-xl outline-none text-sm"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: form.due_date ? "var(--text)" : "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  colorScheme: "dark",
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex gap-3 pt-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "var(--surface-2)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-body)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: saving ? "var(--surface-2)" : "var(--accent)",
                color: saving ? "var(--text-muted)" : "white",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
              }}
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
