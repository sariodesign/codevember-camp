"use client";

import { Calendar } from "@/components/ui/calendar-shadcn";
import EditEventForm from "@/components/forms/EditEventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { toLocalInputDateTime } from "@/utils/date/formatters";
import { Trash } from "lucide-react";
import { Edit } from "lucide-react";

export default function Dashboard() {
  const {
    date,
    eventsForSelectedDate,
    setDate,
    loading,
    hasEvents,
    handleDelete,
    deletingId,
    updatingId,
    isDialogOpen,
    setIsDialogOpen,
    editEventFromValues,
  } = useDashboard();

  console.log("Rendering Dashboard with date:", hasEvents);

  if (loading) {
    return <div className="p-6">Caricamento eventi del calendario...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto h-96">
        <div className=" border rounded-lg p-4 bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={{
              hasEvents,
            }}
            modifiersClassNames={{
              hasEvents:
                "underline decoration-4 decoration-green-600 font-semibold",
            }}
            className="w-full "
          />
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">Eventi del giorno</h2>
          <p className="text-gray-500">
            {date ? date.toLocaleDateString("it-IT") : "Seleziona una data"}
          </p>
          <div className="mt-4 space-y-2">
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map((event) => (
                <div
                  key={event.id}
                  className="p-2 bg-blue-50 border border-blue-200 rounded"
                >
                  <h3 className="font-semibold">{event.summary}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>

                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={"outline"}
                      onClick={() => event.id && handleDelete(event.id)}
                      disabled={deletingId === event.id}
                    >
                      {deletingId === event.id ? "Eliminando..." : <Trash />}
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
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
                            start: toLocalInputDateTime(
                              event.start?.dateTime || ""
                            ),
                            end: toLocalInputDateTime(
                              event.end?.dateTime || ""
                            ),
                          }}
                          onSubmit={async (values) => {
                            try {
                              await editEventFromValues(event, values);
                              setIsDialogOpen(false);
                            } catch (error) {
                              console.error(
                                "Errore durante la modifica dell'evento:",
                                error
                              );
                            }
                          }}
                          onCancel={() => setIsDialogOpen(false)}
                          submitting={updatingId === event.id}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nessun evento per questa data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
