"use client";

import { LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";

type AuthArea = "admin" | "staff";

type AuthStatus = {
  authenticated: boolean;
  demoMode: boolean;
  maxAgeSeconds?: number;
};

const copyByArea = {
  admin: {
    eyebrow: "admin demo",
    title: "管理画面の簡易保護",
    description:
      "これは営業デモ用の管理画面です。診断回答、予約、会員情報、CSV出力を確認できます。",
    productionNote:
      "実案件では管理者ログイン、スタッフ権限、閲覧制限、操作ログが必要です。"
  },
  staff: {
    eyebrow: "staff demo",
    title: "スタッフ画面の簡易保護",
    description:
      "これは店舗スタッフ向けの来店処理デモです。QR会員証を読み取った後のポイント付与を想定しています。",
    productionNote:
      "実案件ではスタッフ専用ログイン後に使います。一般ユーザー向けリッチメニューには出しません。"
  }
} satisfies Record<AuthArea, Record<string, string>>;

export function AdminAuthGate({
  area,
  children
}: {
  area: AuthArea;
  children: ReactNode;
}) {
  const copy = copyByArea[area];
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/admin-status", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: AuthStatus) => setStatus(payload))
      .catch(() => {
        setStatus({ authenticated: false, demoMode: false });
        setError("認証状態を確認できませんでした。時間を置いて再読み込みしてください。");
      });
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      const payload = (await response.json()) as AuthStatus & { error?: string };

      if (!response.ok || !payload.authenticated) {
        setError(payload.error ?? "ログインに失敗しました。");
        return;
      }

      setPassword("");
      setStatus(payload);
    } catch {
      setError("ログイン処理に失敗しました。通信状態を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/admin-logout", { method: "POST" }).catch(() => undefined);
    setStatus({ authenticated: false, demoMode: false });
  }

  if (!status) {
    return (
      <main className="app-shell auth-shell">
        <section className="phone-frame auth-frame">
          <header className="line-header">
            <div>
              <span className="eyebrow">{copy.eyebrow}</span>
              <h1>{copy.title}</h1>
            </div>
          </header>
          <section className="content-stack">
            <article className="card auth-card">
              <span className="section-icon">
                <ShieldCheck size={20} />
              </span>
              <h2>認証状態を確認しています</h2>
              <p>公開デモ用の簡易保護設定を読み込んでいます。</p>
            </article>
          </section>
        </section>
      </main>
    );
  }

  if (!status.authenticated) {
    return (
      <main className="app-shell auth-shell">
        <section className="phone-frame auth-frame">
          <header className="line-header">
            <div>
              <span className="eyebrow">{copy.eyebrow}</span>
              <h1>{copy.title}</h1>
            </div>
          </header>
          <section className="content-stack">
            <article className="card auth-card">
              <span className="section-icon">
                <LockKeyhole size={20} />
              </span>
              <h2>パスワードを入力してください</h2>
              <p>{copy.description}</p>
              <p>{copy.productionNote}</p>
              <form className="auth-form" onSubmit={handleLogin}>
                <label>
                  管理用パスワード
                  <input
                    autoComplete="current-password"
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="RenderのADMIN_PASSWORDを入力"
                    type="password"
                    value={password}
                  />
                </label>
                {error ? <p className="auth-error">{error}</p> : null}
                <button className="primary-button" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "確認中..." : "ログインする"}
                  <ShieldCheck size={20} />
                </button>
              </form>
            </article>
          </section>
        </section>
      </main>
    );
  }

  return (
    <>
      <section className="auth-ribbon" aria-label="管理系ページの保護状態">
        <div>
          <strong>{copy.title}</strong>
          <span>
            {status.demoMode
              ? "ADMIN_PASSWORD未設定のため、ポートフォリオ用デモモードで表示しています。"
              : "ADMIN_PASSWORDによる簡易認証済みです。Cookieの有効期限は約12時間です。"}
          </span>
          <span>{copy.productionNote}</span>
        </div>
        {!status.demoMode ? (
          <button className="mini-button" type="button" onClick={handleLogout}>
            ログアウト
            <LogOut size={16} />
          </button>
        ) : null}
      </section>
      {children}
    </>
  );
}
