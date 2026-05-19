import { initializeLiffProfile } from "@/lib/liff";

export async function initializeLiffUser() {
  const { user } = await initializeLiffProfile();
  return user;
}
