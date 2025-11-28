import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Pagina dashboard dell\'utente',
};

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Benvenuto sulla tua dashboard</p>
    </div>
  );
}
