'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category, CalendarEvent } from '@/types/domain';
import { REMINDER_OPTIONS } from '@/types/domain';
import type { EventInput } from '@/lib/services/events';
import { todayLocalDate } from '@/lib/utils/dates';

const inputClass =
  'w-full rounded-lg border border-(--border) bg-(--background) px-3 py-2 text-sm text-(--foreground) focus-visible:outline-2 focus-visible:outline-(--focus-ring)';

interface EventFormDialogProps {
  open: boolean;
  event: CalendarEvent | null; // null => creating a new event
  defaultDate?: string;
  categories: Category[];
  onClose: () => void;
  onSave: (patch: EventInput) => Promise<void>;
  onDelete?: () => void;
}

export function EventFormDialog({ open, event, defaultDate, categories, onClose, onSave, onDelete }: EventFormDialogProps) {
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
      {/* Keyed so opening a different event (or a different day's "create")
          mounts a fresh form instead of resyncing state via an effect. */}
      {open && (
        <EventFormFields
          key={event?.id ?? `new-${defaultDate ?? ''}`}
          event={event}
          defaultDate={defaultDate}
          categories={categories}
          onClose={onClose}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </dialog>
  );
}

function EventFormFields({
  event,
  defaultDate,
  categories,
  onClose,
  onSave,
  onDelete,
}: {
  event: CalendarEvent | null;
  defaultDate?: string;
  categories: Category[];
  onClose: () => void;
  onSave: (patch: EventInput) => Promise<void>;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState(() => fromEvent(event, defaultDate));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.startDate) {
      setError('El evento necesita al menos un título y una fecha.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: form.title,
        description: form.description || null,
        startDate: form.startDate,
        startTime: form.allDay ? null : form.startTime || null,
        endDate: form.endDate || null,
        endTime: form.allDay ? null : form.endTime || null,
        allDay: form.allDay,
        categoryId: form.categoryId || null,
        reminderMinutes: form.allDay ? null : form.reminderMinutes,
      });
      onClose();
    } catch {
      setError('No se pudo guardar el evento. Tus cambios siguen aquí, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-h-[85vh] overflow-y-auto p-5">
      <h2 className="text-base font-semibold">{event ? 'Editar evento' : 'Nuevo evento'}</h2>

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

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.allDay}
            onChange={(e) => setForm((f) => ({ ...f, allDay: e.target.checked }))}
            className="h-4 w-4 accent-(--primary)"
          />
          Todo el día
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha inicio *">
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className={inputClass}
            />
          </Field>
          {!form.allDay && (
            <Field label="Hora inicio">
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className={inputClass}
              />
            </Field>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha fin">
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              className={inputClass}
            />
          </Field>
          {!form.allDay && (
            <Field label="Hora fin">
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className={inputClass}
              />
            </Field>
          )}
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

        {!form.allDay && (
          <Field label="Recordatorio">
            <select
              value={form.reminderMinutes === null ? '' : form.reminderMinutes}
              onChange={(e) =>
                setForm((f) => ({ ...f, reminderMinutes: e.target.value === '' ? null : Number(e.target.value) }))
              }
              className={inputClass}
            >
              {REMINDER_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.value === null ? '' : opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-(--danger)">
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between">
        {onDelete ? (
          <button type="button" onClick={onDelete} className="text-sm text-(--danger) hover:underline">
            Eliminar
          </button>
        ) : (
          <span />
        )}
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

function fromEvent(event: CalendarEvent | null, defaultDate?: string) {
  return {
    title: event?.title ?? '',
    description: event?.description ?? '',
    startDate: event?.startDate ?? defaultDate ?? todayLocalDate(),
    startTime: event?.startTime?.slice(0, 5) ?? '',
    endDate: event?.endDate ?? '',
    endTime: event?.endTime?.slice(0, 5) ?? '',
    allDay: event?.allDay ?? false,
    categoryId: event?.categoryId ?? '',
    reminderMinutes: event?.reminderMinutes ?? null,
  };
}
