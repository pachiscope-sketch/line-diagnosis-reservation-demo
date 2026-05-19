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
    modeLabel: getLiffModeLabel(user.liffStatus, error)
  };
}

function getLiffModeLabel(status: LiffUser["liffStatus"], error?: string) {
  if (error || status === "error") {
    return "LIFF初期化エラー：デモユーザーに切り替えています";
  }

  if (status === "connected") {
    return "LINE連携中：実際のLINEプロフィールを使用しています";
  }

  if (status === "loginRequired") {
    return "LIFF設定済み：LINEログイン前のためプレビュー表示です";
  }

  return "LIFF未設定：モックユーザーとして表示しています";
}
