import type { LiffUser } from "@/lib/types";

type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

type LiffInstance = {
  init: (config: { liffId: string }) => Promise<void>;
  isLoggedIn: () => boolean;
  login: () => void;
  getProfile: () => Promise<LiffProfile>;
  isInClient: () => boolean;
};

export const mockLiffUser: LiffUser = {
  mode: "mock",
  userId: "Udemo1234567890",
  displayName: "Demo User",
  pictureUrl: "",
  isInClient: false,
  isLoggedIn: false
};

export function shouldUseMockLiff() {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    !process.env.NEXT_PUBLIC_LIFF_ID
  );
}

export async function initializeLiffProfile(): Promise<{
  user: LiffUser;
  login?: () => void;
  error?: string;
}> {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

  if (typeof window === "undefined" || shouldUseMockLiff() || !liffId) {
    return { user: mockLiffUser };
  }

  try {
    const liffModule = await import("@line/liff");
    const liff = (liffModule.default ?? liffModule) as LiffInstance;

    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
      return {
        user: {
          ...mockLiffUser,
          displayName: "LINEログイン前のデモユーザー",
          isInClient: liff.isInClient()
        },
        login: () => liff.login()
      };
    }

    const profile = await liff.getProfile();

    return {
      user: {
        mode: "liff",
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        isInClient: liff.isInClient(),
        isLoggedIn: true
      },
      login: () => liff.login()
    };
  } catch (error) {
    console.log("[liff fallback to mock]", error);
    return {
      user: mockLiffUser,
      error: "LIFF初期化に失敗したため、モックモードで表示しています。"
    };
  }
}
