"use client";

import { useState, useMemo } from "react";
import type { EditEventFormValues } from "./EditEventForm";

export default function CreateEventForm({
  selectedDate,
  onSubmit,
  onCancel,
  submitting,
}: {
  selectedDate: Date | undefined;
  onSubmit: (values: EditEventFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  // Calcola i valori iniziali in base alla data selezionata
  const defaultValues = useMemo(() => {
    if (!selectedDate) {
      return {
        summary: "",
        description: "",
        start: "",
        end: "",
      };
    }

    // Crea una data alle 10:00 della data selezionata
    const startDate = new Date(selectedDate);
    startDate.setHours(10, 0, 0, 0);
    const startString = startDate.toISOString().slice(0, 16);

    // Fine alle 11:00
    const endDate = new Date(startDate);
    endDate.setHours(11, 0, 0, 0);
    const endString = endDate.toISOString().slice(0, 16);

    return {
      summary: "",
      description: "",
      start: startString,
      end: endString,
    };
  }, [selectedDate]);

  const [values, setValues] = useState<EditEventFormValues>(defaultValues);

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

      <div>
        <label className="block text-sm">Location</label>
        <textarea
          value={values.location ?? ""}
          onChange={(e) =>
            setValues((s) => ({ ...s, location: e.target.value }))
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
          className="px-3 py-1 rounded bg-gray-200 hover:cursor-pointer"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={submitting || !isValid}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:cursor-pointer"
        >
          {submitting ? "Creando..." : "Crea"}
        </button>
      </div>
    </form>
  );
}
