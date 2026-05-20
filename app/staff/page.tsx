import { AdminAuthGate } from "@/components/AdminAuthGate";
import { StaffCheckinDemo } from "@/components/StaffCheckinDemo";
import {
  ADMIN_AUTH_MAX_AGE_SECONDS,
  isAdminAuthEnabled,
  isAdminRequestAuthenticated
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const authStatus = await getStaffPageAuthStatus();

  return (
    <AdminAuthGate area="staff" initialStatus={authStatus}>
      {authStatus.authenticated ? <StaffCheckinDemo /> : null}
    </AdminAuthGate>
  );
}

async function getStaffPageAuthStatus() {
  const demoMode = !isAdminAuthEnabled();
  const authenticated = demoMode || (await isAdminRequestAuthenticated());

  return {
    authenticated,
    demoMode,
    maxAgeSeconds: ADMIN_AUTH_MAX_AGE_SECONDS
  };
}
