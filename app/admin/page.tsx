import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminDashboard } from "@/components/AdminDashboard";
import {
  ADMIN_AUTH_MAX_AGE_SECONDS,
  isAdminAuthEnabled,
  isAdminRequestAuthenticated
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authStatus = await getAdminPageAuthStatus();

  return (
    <AdminAuthGate area="admin" initialStatus={authStatus}>
      {authStatus.authenticated ? <AdminDashboard /> : null}
    </AdminAuthGate>
  );
}

async function getAdminPageAuthStatus() {
  const demoMode = !isAdminAuthEnabled();
  const authenticated = demoMode || (await isAdminRequestAuthenticated());

  return {
    authenticated,
    demoMode,
    maxAgeSeconds: ADMIN_AUTH_MAX_AGE_SECONDS
  };
}
