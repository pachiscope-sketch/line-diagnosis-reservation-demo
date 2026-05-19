"use client";

import { useEffect, useState } from "react";
import { initializeLiffProfile, mockLiffUser } from "@/lib/liff";
import type { LiffUser } from "@/lib/types";

export function useLiff() {
  const [user, setUser] = useState<LiffUser>(mockLiffUser);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [login, setLogin] = useState<(() => void) | undefined>();

  useEffect(() => {
    let mounted = true;

    initializeLiffProfile().then((result) => {
      if (!mounted) {
        return;
      }

      setUser(result.user);
      setLogin(() => result.login);
      setError(result.error);
      setIsReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    isReady,
    error,
    login,
    modeLabel:
      user.mode === "liff"
        ? "LINE連携中：実際のLINEプロフィールを使用しています"
        : "モックモード：デモユーザーとして表示しています"
  };
}
