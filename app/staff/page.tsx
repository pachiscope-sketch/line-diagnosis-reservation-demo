import { AdminAuthGate } from "@/components/AdminAuthGate";
import { StaffCheckinDemo } from "@/components/StaffCheckinDemo";

export default function StaffPage() {
  return (
    <AdminAuthGate area="staff">
      <StaffCheckinDemo />
    </AdminAuthGate>
  );
}
