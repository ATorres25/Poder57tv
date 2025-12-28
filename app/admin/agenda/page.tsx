import AgendaList from "@/components/admin/AgendaList";

export default function AdminAgendaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Agenda de Partidos</h1>
      <AgendaList />
    </div>
  );
}
