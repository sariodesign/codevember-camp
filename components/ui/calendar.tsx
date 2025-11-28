"use client";

import { useState, useMemo } from "react";
import { Button } from "./button";
import { Edit, Trash, CalendarPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import EditEventForm, { EditEventFormValues } from "../forms/EditEventForm";
import CreateEventForm from "../forms/CreateEventForm";
import { toLocalInputDateTime } from "@/utils/date/formatters";
import { CalendarEvent } from "@/types/event";

type CalendarItem = CalendarEvent;

type CalendarProps = {
  items: CalendarItem[];
  onDelete: (id: string) => void;
  deletingId: string | null;
  editEventFromValues: (
    event: CalendarItem,
    values: EditEventFormValues
  ) => Promise<void>;
  updatingId: string | null;
  setUpdatingId?: (id: string | null) => void;
  createEventFromValues: (
    values: EditEventFormValues,
    selectedDate: Date | undefined
  ) => Promise<void>;
  creatingId: boolean;
};

const formatMonthYear = (date: Date) =>
  date.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

const getDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const createMonthGrid = (month: Date): Date[] => {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(startOfMonth);

  // Lunedì come primo giorno della settimana
  const weekday = start.getDay(); // 0=Dom, 1=Lun, ...
  const offset = (weekday + 6) % 7; // trasformo in indice con lunedì=0
  start.setDate(start.getDate() - offset);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
};

export default function Calendar({
  items,
  onDelete,
  deletingId,
  editEventFromValues,
  updatingId,
  createEventFromValues,
  creatingId,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [isDialogOpen, setIsDialogOpen] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    () => new Date()
  );

  const days = useMemo(() => createMonthGrid(currentMonth), [currentMonth]);

  const todayKey = getDateKey(new Date());
  const selectedKey = selectedDate ? getDateKey(selectedDate) : null;
  const monthIndex = currentMonth.getMonth();

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();

    for (const item of items) {
      if (!item.start?.dateTime) continue;
      const eventDate = new Date(item.start.dateTime);
      const key = getDateKey(eventDate);

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }

    return map;
  }, [items]);

  const visibleEvents =
    selectedKey && eventsByDate.get(selectedKey)
      ? eventsByDate.get(selectedKey)!
      : ([] as CalendarItem[]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  console.log("ad");

  return (
    <div className="w-full mx-auto rounded-3xl">
      <div className="rounded-3xl bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-semibold capitalize text-slate-900">
              {formatMonthYear(currentMonth)}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="h-9 w-9 rounded-full border border-slate-100 bg-white shadow-sm flex items-center justify-center text-slate-600 text-lg leading-none hover:-translate-y-0.5 hover:shadow-md transition"
              aria-label="Mese precedente"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="h-9 w-9 rounded-full border border-slate-100 bg-white shadow-sm flex items-center justify-center text-slate-600 text-lg leading-none hover:-translate-y-0.5 hover:shadow-md transition"
              aria-label="Mese successivo"
            >
              ›
            </button>
          </div>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500 mb-2">
          {[
            "Lunedì",
            "Martedì",
            "Mercoledì",
            "Giovedì",
            "Venerdì",
            "Sabato",
            "Domenica",
          ].map((label) => (
            <div key={label} className="py-1">
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border border-slate-300 rounded-md overflow-hidden gap-px bg-slate-300 mb-4">
          {days.map((day) => {
            const key = getDateKey(day);
            const isToday = key === todayKey;
            const isSelected = selectedKey === key;
            const isCurrentMonth = day.getMonth() === monthIndex;
            const events = eventsByDate.get(key) ?? [];
            const hasEvents = events.length > 0;

            const baseClasses =
              "min-h-[100px] flex flex-col items-center justify-center px-2 text-xs sm:text-sm cursor-pointer transition relative";
            let colorClasses = "";

            if (isSelected) {
              colorClasses = "bg-slate-200";
            } else if (!isCurrentMonth) {
              colorClasses = "bg-white text-slate-300 hover:bg-slate-50/60";
            } else {
              colorClasses = "bg-white text-slate-700 hover:bg-slate-50";
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectDate(day)}
                className={`${baseClasses} ${colorClasses}`}
              >
                <span className="font-semibold">{day.getDate()}</span>

                {hasEvents && (
                  <div className="flex flex-col">
                    <div className={`flex flex-col mt-1 text-xs font-bold items-center justify-center rounded-md px-2 py-2 leading-md ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-blue-200 text-slate-700"
                        }`}>

                      <span>
                        {events.length === 1 ? `${events[0].summary}` : `${events.length} eventi`}
                      </span>
                      {events.length === 1 && events[0].start?.dateTime && (
                        <span className="font-normal text-xs">
                          {`${new Date(events[0].start.dateTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`} - {`${new Date(events[0].end.dateTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {isToday && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400 border border-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day events */}
        <div className="rounded-md bg-slate-50/80 border border-slate-100 p-3 sm:p-4">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div className="flex justify-between items-baseline gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                Eventi del giorno
              </p>
            </div>
            <Dialog
                open={isDialogOpen === "new"}
                onOpenChange={(open) => {
                  if (open) setIsDialogOpen("new");
                  else setIsDialogOpen("");
                }}
              >
                <DialogTrigger asChild>
                  <Button variant={"outline"}>
                    <CalendarPlus />
                    <span>Aggiungi evento</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crea nuovo evento</DialogTitle>
                  </DialogHeader>
                  <CreateEventForm
                    selectedDate={selectedDate ?? undefined}
                    onSubmit={async (values) => {
                      try {
                        setIsDialogOpen("");
                        await createEventFromValues(
                          values,
                          selectedDate ?? undefined
                        );
                      } catch (error) {
                        console.error(
                          "Errore durante la creazione dell'evento:",
                          error
                        );
                      }
                    }}
                    onCancel={() => setIsDialogOpen("")}
                    submitting={creatingId}
                  />
                </DialogContent>
              </Dialog>
          </div>
          <div className="flex justify-end">
            
          </div>
          {visibleEvents && visibleEvents.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-400">
              {" "}
              Nessun evento per questa data. 🍊
            </p>
          ) : (
            <ul className="space-y-4">
              {visibleEvents.map((event, idx) => (
                <li
                  key={event.id + idx}
                  className="flex items-center cursor-pointer justify-between px-3 py-2 border-b border-slate-200"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {event.summary}
                    </p>
                    {event.location && (
                      <p className="text-xs text-slate-600">{event.location}</p>
                    )}
                    <p className="text-xs text-slate-400">
                      {event.start?.dateTime
                        ? new Date(event.start.dateTime).toLocaleString("it-IT", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ''}{" "}-{" "}
                      {event.end?.dateTime
                        ? new Date(event.end.dateTime).toLocaleString("it-IT", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ''}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Dialog
                      key={updatingId}
                      open={event.id === isDialogOpen}
                      onOpenChange={(open) =>{
                        if (open) setIsDialogOpen(event.id)
                        else setIsDialogOpen("");
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant={"secondary"}>
                          <Edit />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Modifica evento</DialogTitle>
                        </DialogHeader>

                        <EditEventForm
                          initial={{
                            summary: event.summary || "",
                            description: event.description || "",
                            location: event.location || "",
                            start: toLocalInputDateTime(
                              event.start?.dateTime || ""
                            ),
                            end: toLocalInputDateTime(
                              event.end?.dateTime || ""
                            ),
                          }}
                          onSubmit={async (values) => {
                            try {
                              setIsDialogOpen("");
                              await editEventFromValues(event, values);
                            } catch (error) {
                              console.error(
                                "Errore durante la modifica dell'evento:",
                                error
                              );
                            }
                          }}
                          onCancel={() => setIsDialogOpen("")}
                          submitting={updatingId === event.id}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant={"destructive"}
                      onClick={() => onDelete(event.id)}
                      disabled={deletingId === event.id}
                    >
                      {deletingId === event.id ? "Eliminando..." : <Trash />}
                    </Button>

                  
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
