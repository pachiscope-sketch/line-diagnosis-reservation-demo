import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <AdminAuthGate area="admin">
      <AdminDashboard />
    </AdminAuthGate>
  );
}
