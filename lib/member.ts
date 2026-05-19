import type { CustomerRecord, LiffUser } from "@/lib/types";

export function createCustomerFromUser(user: LiffUser): CustomerRecord {
  const suffix = user.userId.slice(-4).padStart(4, "0");
  const id = `LINE-DEMO-${suffix}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    id,
    createdAt: new Date().toISOString(),
    lineUserId: user.userId,
    lineDisplayName: user.displayName,
    memberQrCode: `${appUrl}/member-card?member=${id}&lineUserId=${user.userId}`,
    points: 120,
    visitCount: 3,
    lastVisitAt: new Date().toISOString()
  };
}

export function addVisitStamp(customer: CustomerRecord): CustomerRecord {
  return {
    ...customer,
    points: customer.points + 40,
    visitCount: customer.visitCount + 1,
    lastVisitAt: new Date().toISOString()
  };
}
