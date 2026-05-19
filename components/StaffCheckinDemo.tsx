"use client";

import {
  ArrowLeft,
  CalendarCheck,
  IdCard,
  QrCode,
  ScanLine,
  Stamp,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addVisitStamp } from "@/lib/member";
import { mockCustomers } from "@/lib/mockData";
import { loadCustomers, saveCustomer } from "@/lib/storage";
import type { CustomerRecord } from "@/lib/types";

export function StaffCheckinDemo() {
  const [customer, setCustomer] = useState<CustomerRecord>(mockCustomers[0]);
  const [message, setMessage] = useState(
    "QR会員証を読み取った後、スタッフが来店処理する想定の画面です。"
  );

  useEffect(() => {
    const localCustomer = loadCustomers()[0];
    if (localCustomer) {
      setCustomer(localCustomer);
      return;
    }

    fetch("/api/customers")
      .then((response) => response.json())
      .then((payload: { customers?: CustomerRecord[] }) => {
        if (payload.customers?.[0]) {
          setCustomer(payload.customers[0]);
        }
      })
      .catch(() => undefined);
  }, []);

  function checkIn() {
    const nextCustomer = addVisitStamp(customer);
    setCustomer(nextCustomer);
    saveCustomer(nextCustomer);
    setMessage(
      `${nextCustomer.lineDisplayName}さんの来店処理を完了しました。40pt付与されています。`
    );

    fetch("/api/customers", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nextCustomer)
    }).catch((error) => console.log("[staff check-in api failed]", error));
  }

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="スタッフ向け来店処理デモ">
        <header className="line-header">
          <div>
            <span className="eyebrow">staff check-in</span>
            <h1>来店処理デモ</h1>
          </div>
          <nav className="header-actions" aria-label="デモ内リンク">
            <Link href="/member-card">会員証</Link>
            <Link href="/admin">管理</Link>
          </nav>
        </header>

        <section className="content-stack">
          <Link className="text-button" href="/member-card">
            <ArrowLeft size={18} />
            会員証へ戻る
          </Link>

          <div className="demo-warning" role="note">
            スタッフ専用デモ画面です。本番では認証を付け、一般ユーザー向けリッチメニューには表示しません。
          </div>

          <article className="card result-card">
            <span className="section-icon">
              <ScanLine size={20} />
            </span>
            <p className="eyebrow">店舗スタッフ画面</p>
            <h2>QR読み取り後の来店処理を想定</h2>
            <p>
              実案件では、スタッフだけが使える画面として、QR読み取り、ポイント付与、来店履歴更新を行います。
            </p>
          </article>

          <article className="card">
            <span className="section-icon">
              <IdCard size={20} />
            </span>
            <h2>{customer.lineDisplayName}</h2>
            <dl className="detail-list">
              <div>
                <dt>会員番号</dt>
                <dd>{customer.id}</dd>
              </div>
              <div>
                <dt>QRコード値</dt>
                <dd>{customer.memberQrCode}</dd>
              </div>
              <div>
                <dt>現在のポイント</dt>
                <dd>{customer.points} pt</dd>
              </div>
              <div>
                <dt>来店回数</dt>
                <dd>{customer.visitCount}回</dd>
              </div>
            </dl>
          </article>

          <div className="staff-panel">
            <div>
              <QrCode size={18} />
              <span>{customer.memberQrCode}</span>
            </div>
            <p>{message}</p>
            <button className="primary-button" type="button" onClick={checkIn}>
              QR読み取り後の来店処理
              <CalendarCheck size={20} />
            </button>
          </div>

          <article className="card compact-card">
            <span className="section-icon">
              <UserCheck size={20} />
            </span>
            <h3>発注者に見せるポイント</h3>
            <p>
              ユーザー向け会員証、スタッフ向け来店処理、管理画面の3画面を分けることで、実運用を想定した店舗DX提案として見せられます。
            </p>
          </article>

          <Link className="secondary-button" href="/admin">
            管理画面で会員一覧を見る
            <Stamp size={20} />
          </Link>
        </section>
      </section>
    </main>
  );
}
