"use client";
// ...existing code...
import { useState } from "react";

export type EditEventFormValues = {
  summary?: string;
  description?: string;
  start?: string;
  end?: string;
};

export default function EditEventForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial: EditEventFormValues;
  onSubmit: (values: EditEventFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<EditEventFormValues>(initial);

  const isValid = values.start && values.end && values.start <= values.end;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm">Titolo</label>
        <input
          value={values.summary ?? ""}
          onChange={(e) =>
            setValues((s) => ({ ...s, summary: e.target.value }))
          }
          className="w-full rounded border px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm">Descrizione</label>
        <textarea
          value={values.description ?? ""}
          onChange={(e) =>
            setValues((s) => ({ ...s, description: e.target.value }))
          }
          className="w-full rounded border px-2 py-1"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Inizio</label>
          <input
            type="datetime-local"
            value={values.start ?? ""}
            onChange={(e) =>
              setValues((s) => ({ ...s, start: e.target.value }))
            }
            className="w-full rounded border px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm">Fine</label>
          <input
            type="datetime-local"
            value={values.end ?? ""}
            onChange={(e) => setValues((s) => ({ ...s, end: e.target.value }))}
            className="w-full rounded border px-2 py-1"
          />
        </div>
      </div>
      <div>
        {!isValid && (
          <p className="text-sm text-red-500">
            La data di fine non può essere più recente di quella di inizio
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 rounded bg-gray-200"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={submitting || !isValid}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          {submitting ? "Salvando..." : "Salva"}
        </button>
      </div>
    </form>
  );
}
// ...existing code...
