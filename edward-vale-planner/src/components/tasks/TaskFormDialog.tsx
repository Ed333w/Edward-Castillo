'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category, Priority, Task, TaskStatus } from '@/types/domain';
import { PRIORITY_LABELS, REMINDER_OPTIONS, STATUS_LABELS } from '@/types/domain';
import type { TaskInput } from '@/lib/services/tasks';

const inputClass =
  'w-full rounded-lg border border-(--border) bg-(--background) px-3 py-2 text-sm text-(--foreground) focus-visible:outline-2 focus-visible:outline-(--focus-ring)';

interface TaskFormDialogProps {
  open: boolean;
  task: Task | null;
  categories: Category[];
  onClose: () => void;
  onSave: (patch: Partial<TaskInput & { status: TaskStatus }>) => Promise<void>;
  onDelete: () => void;
}

export function TaskFormDialog({ open, task, categories, onClose, onSave, onDelete }: TaskFormDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      className="m-auto w-full max-w-md rounded-xl border border-(--border) bg-(--surface) p-0 text-(--foreground) backdrop:bg-black/40"
    >
      {/* Keyed by task id so switching tasks mounts a fresh form instead of
          needing an effect to resync state from the new `task` prop. */}
      {task && (
        <TaskFormFields
          key={task.id}
          task={task}
          categories={categories}
          onClose={onClose}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </dialog>
  );
}

function TaskFormFields({
  task,
  categories,
  onClose,
  onSave,
  onDelete,
}: {
  task: Task;
  categories: Category[];
  onClose: () => void;
  onSave: (patch: Partial<TaskInput & { status: TaskStatus }>) => Promise<void>;
  onDelete: () => void;
}) {
  const [form, setForm] = useState(() => fromTask(task));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('El titulo no puede estar vacio.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: form.title,
        description: form.description || null,
        dueDate: form.dueDate || null,
        dueTime: form.dueDate ? form.dueTime || null : null,
        priority: form.priority,
        categoryId: form.categoryId || null,
        reminderMinutes: form.dueDate ? form.reminderMinutes : null,
        status: form.status,
      });
      onClose();
    } catch {
      setError('No se pudo guardar. Tus cambios siguen en el formulario, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-h-[85vh] overflow-y-auto p-5">
      <h2 className="text-base font-semibold">Editar tarea</h2>

      <div className="mt-4 space-y-4">
        <Field label="Título *">
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={inputClass}
          />
        </Field>

        <Field label="Descripción">
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha">
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Hora">
            <input
              type="time"
              value={form.dueTime}
              disabled={!form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueTime: e.target.value }))}
              className={`${inputClass} disabled:opacity-50`}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Prioridad">
            <select
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
              className={inputClass}
            >
              {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Estado">
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
              className={inputClass}
            >
              {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Categoría">
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Recordatorio">
          <select
            value={form.reminderMinutes === null ? '' : form.reminderMinutes}
            disabled={!form.dueDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, reminderMinutes: e.target.value === '' ? null : Number(e.target.value) }))
            }
            className={`${inputClass} disabled:opacity-50`}
          >
            {REMINDER_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value === null ? '' : opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-(--danger)">
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between">
        <button type="button" onClick={onDelete} className="text-sm text-(--danger) hover:underline">
          Eliminar
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-(--surface-hover)"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-(--primary) px-3 py-1.5 text-sm font-medium text-(--primary-foreground) disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-(--muted)">{label}</span>
      {children}
    </label>
  );
}

function fromTask(task: Task) {
  return {
    title: task.title,
    description: task.description ?? '',
    dueDate: task.dueDate ?? '',
    dueTime: task.dueTime?.slice(0, 5) ?? '',
    priority: task.priority,
    categoryId: task.categoryId ?? '',
    status: task.status,
    reminderMinutes: task.reminderMinutes,
  } satisfies {
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: Priority;
    categoryId: string;
    status: TaskStatus;
    reminderMinutes: number | null;
  };
}
