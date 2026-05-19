"use client";

import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  IdCard,
  QrCode,
  ScanLine,
  Sparkles,
  Stamp
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import { useLiff } from "@/hooks/useLiff";
import {
  findCustomerByLineUserId,
  saveCustomer
} from "@/lib/storage";
import type { CustomerRecord, LiffUser } from "@/lib/types";

export function MemberCardDemo() {
  const { user, modeLabel } = useLiff();
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  const [staffMessage, setStaffMessage] = useState(
    "QRを読み取った後、スタッフが来店処理する想定の画面です。"
  );

  useEffect(() => {
    const localCustomer = findCustomerByLineUserId(user.userId);

    if (localCustomer) {
      setCustomer(localCustomer);
      return;
    }

    fetch(`/api/customers?lineUserId=${encodeURIComponent(user.userId)}`)
      .then((response) => response.json())
      .then((payload: { customers?: CustomerRecord[] }) => {
        const remoteCustomer = payload.customers?.[0];
        const nextCustomer = remoteCustomer ?? createCustomer(user);
        setCustomer(nextCustomer);
        saveCustomer(nextCustomer);

        if (!remoteCustomer) {
          return fetch("/api/customers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(nextCustomer)
          });
        }

        return undefined;
      })
      .catch(() => {
        const nextCustomer = createCustomer(user);
        setCustomer(nextCustomer);
        saveCustomer(nextCustomer);
      });
  }, [user]);

  const qrValue = useMemo(
    () =>
      customer?.memberQrCode ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/member-card`,
    [customer]
  );

  function addVisitStamp() {
    if (!customer) {
      return;
    }

    const nextCustomer: CustomerRecord = {
      ...customer,
      points: customer.points + 40,
      visitCount: customer.visitCount + 1,
      lastVisitAt: new Date().toISOString()
    };

    setCustomer(nextCustomer);
    saveCustomer(nextCustomer);
    setStaffMessage(
      `${nextCustomer.lineDisplayName}さんの来店処理を完了しました。40pt付与されています。`
    );

    fetch("/api/customers", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nextCustomer)
    }).catch((error) => console.log("[customer stamp api failed]", error));
  }

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="LINE会員証デモ">
        <header className="line-header">
          <div>
            <span className="eyebrow">membership demo</span>
            <h1>LINE会員証</h1>
          </div>
          <nav className="header-actions" aria-label="デモ内リンク">
            <Link href="/">診断</Link>
            <Link href="/admin">管理</Link>
          </nav>
        </header>

        <section className="content-stack">
          <Link className="text-button" href="/">
            <ArrowLeft size={18} />
            診断デモへ戻る
          </Link>

          <article className="card result-card">
            <span className="section-icon">
              <IdCard size={20} />
            </span>
            <p className="eyebrow">QR会員証デモ</p>
            <h2>紙のポイントカードをLINE内に置き換えるデモ</h2>
            <p>
              LINE User IDまたはモックIDを使い、会員番号、ポイント、来店回数を表示します。
              店舗、美容室、整体、スクールの会員管理案件に応用できます。
            </p>
          </article>

          <div className="member-card">
            <div className="member-card-head">
              <div>
                <span>LINE MEMBER CARD</span>
                <strong>{customer?.id ?? "LINE-DEMO-0001"}</strong>
              </div>
              <BadgeCheck size={28} />
            </div>

            <div className="qr-box">
              <QRCodeSVG value={qrValue} size={184} level="M" includeMargin />
            </div>

            <dl className="member-stats">
              <div>
                <dt>表示名</dt>
                <dd>{customer?.lineDisplayName ?? user.displayName}</dd>
              </div>
              <div>
                <dt>ポイント</dt>
                <dd>{customer?.points ?? 0} pt</dd>
              </div>
              <div>
                <dt>来店回数</dt>
                <dd>{customer?.visitCount ?? 0}回</dd>
              </div>
              <div>
                <dt>最終来店日</dt>
                <dd>{formatDate(customer?.lastVisitAt)}</dd>
              </div>
            </dl>

            <p className="member-note">{modeLabel}</p>
          </div>

          <button className="primary-button" type="button" onClick={addVisitStamp}>
            来店スタンプを追加
            <Stamp size={20} />
          </button>

          <article className="card">
            <span className="section-icon">
              <ScanLine size={20} />
            </span>
            <h2>スタッフ向け来店処理モック</h2>
            <p>
              実案件では、スタッフがQRを読み取り、来店履歴とポイントを更新する画面にできます。
            </p>
            <div className="staff-panel">
              <div>
                <QrCode size={18} />
                <span>{customer?.memberQrCode ?? "QR読み取り待ち"}</span>
              </div>
              <p>{staffMessage}</p>
              <button className="secondary-button" type="button" onClick={addVisitStamp}>
                QR読み取り後の来店処理
                <CalendarCheck size={20} />
              </button>
            </div>
          </article>

          <article className="card compact-card">
            <span className="section-icon">
              <Sparkles size={20} />
            </span>
            <h3>この機能は実案件ではこう使えます</h3>
            <p>
              来店ポイント、回数券、誕生日クーポン、休眠顧客の呼び戻し、スタッフ向け来店チェックインに展開できます。
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}

function createCustomer(user: LiffUser): CustomerRecord {
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

function formatDate(value?: string) {
  if (!value) {
    return "未登録";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
