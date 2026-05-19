"use client";

import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Database,
  Download,
  ExternalLink,
  FileSpreadsheet,
  IdCard,
  ListChecks,
  MessageSquareText,
  PlusCircle,
  PlugZap,
  RefreshCw,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { demoPatterns } from "@/lib/demoPatterns";
import { mockCustomers, mockDiagnoses, mockReservations } from "@/lib/mockData";
import {
  clearLocalDemoData,
  loadCustomers,
  loadDiagnoses,
  loadReservations,
  replaceCustomers,
  replaceDiagnoses,
  replaceReservations
} from "@/lib/storage";
import type {
  AdminData,
  CustomerRecord,
  DemoType,
  DiagnosisRecord,
  ReservationRecord
} from "@/lib/types";

type FilterType = "all" | DemoType;

const initialAdminData: AdminData = {
  mode: "mock",
  diagnoses: mockDiagnoses,
  reservations: mockReservations,
  customers: mockCustomers,
  status: {
    supabaseConfigured: false,
    slackConfigured: false,
    liffConfigured: false,
    mockMode: true
  }
};

export function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData>(initialAdminData);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetch("/api/admin-data")
      .then((response) => response.json())
      .then((remoteData: AdminData) => {
        const localDiagnoses = loadDiagnoses();
        const localReservations = loadReservations();
        const localCustomers = loadCustomers();

        setAdminData({
          ...remoteData,
          mode:
            remoteData.mode === "supabase" && !localDiagnoses.length
              ? "supabase"
              : localDiagnoses.length || localReservations.length || localCustomers.length
                ? "local"
                : remoteData.mode,
          diagnoses: mergeById(localDiagnoses, remoteData.diagnoses),
          reservations: mergeById(localReservations, remoteData.reservations),
          customers: mergeById(localCustomers, remoteData.customers)
        });
      })
      .catch(() => {
        setAdminData({
          ...initialAdminData,
          mode: "local",
          diagnoses: mergeById(loadDiagnoses(), mockDiagnoses),
          reservations: mergeById(loadReservations(), mockReservations),
          customers: mergeById(loadCustomers(), mockCustomers)
        });
      });
  }, []);

  const diagnoses = useMemo(
    () => filterByDemo(adminData.diagnoses, filter),
    [adminData.diagnoses, filter]
  );
  const reservations = useMemo(
    () => filterByDemo(adminData.reservations, filter),
    [adminData.reservations, filter]
  );
  const customers = adminData.customers;

  const industryCounts = useMemo(
    () => countBy(diagnoses, (item) => item.answers.industry),
    [diagnoses]
  );
  const goalCounts = useMemo(
    () => countBy(diagnoses, (item) => item.answers.goal),
    [diagnoses]
  );
  const demoCounts = useMemo(
    () => countBy(adminData.diagnoses, (item) => demoPatterns[item.sourceDemoType].label),
    [adminData.diagnoses]
  );

  function addDemoData() {
    const nextData: AdminData = {
      ...adminData,
      mode: "local",
      diagnoses: mergeById(mockDiagnoses, adminData.diagnoses),
      reservations: mergeById(mockReservations, adminData.reservations),
      customers: mergeById(mockCustomers, adminData.customers)
    };

    replaceDiagnoses(nextData.diagnoses);
    replaceReservations(nextData.reservations);
    replaceCustomers(nextData.customers);
    setAdminData(nextData);
  }

  function resetLocalData() {
    clearLocalDemoData();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <main className="app-shell admin-shell">
      <section className="phone-frame admin-frame">
        <header className="line-header">
          <div>
            <span className="eyebrow">dashboard</span>
            <h1>管理画面</h1>
          </div>
          <nav className="header-actions" aria-label="デモ内リンク">
            <Link href="/">診断</Link>
            <Link href="/member-card">会員証</Link>
            <Link href="/staff">スタッフ</Link>
            <Link href="/line-flow">導線</Link>
          </nav>
        </header>

        <section className="content-stack admin-content">
          <Link className="text-button" href="/">
            <ArrowLeft size={18} />
            デモ画面へ
          </Link>

          <div className="demo-warning" role="note">
            ポートフォリオ用デモです。実際の個人情報は入力しないでください。
          </div>

          <div className="status-strip">
            <StatusPill
              icon={<Database size={16} />}
              label="保存先"
              value={getStorageLabel(adminData.mode)}
            />
            <StatusPill
              icon={<PlugZap size={16} />}
              label="Supabase"
              value={adminData.status.supabaseConfigured ? "設定済み" : "未設定"}
            />
            <StatusPill
              icon={<MessageSquareText size={16} />}
              label="Slack"
              value={adminData.status.slackConfigured ? "通知ON" : "モック通知"}
            />
            <StatusPill
              icon={<Users size={16} />}
              label="LIFF"
              value={adminData.status.liffConfigured ? "接続可" : "モック"}
            />
          </div>

          <article className="card admin-note-card">
            <h2>連携状態の見方</h2>
            <p>
              保存先は、Supabase設定済みならDB、未設定ならブラウザ内のローカル保存またはモックデータです。
              Slack未設定時は通知をconsole.logに出すため、営業デモ中に画面は止まりません。
              LIFF未設定時はモックユーザー、設定済み未ログイン時はLINEログイン前プレビューとして表示します。
            </p>
          </article>

          <div className="admin-action-row">
            <button className="secondary-button" type="button" onClick={addDemoData}>
              デモデータを追加
              <PlusCircle size={20} />
            </button>
            <button className="secondary-button" type="button" onClick={resetLocalData}>
              ローカルデータをリセット
              <RefreshCw size={20} />
            </button>
            <Link className="secondary-button" href="/staff">
              スタッフ画面へ
              <ExternalLink size={20} />
            </Link>
            <Link className="secondary-button" href="/member-card">
              会員証画面へ
              <IdCard size={20} />
            </Link>
          </div>

          <div className="filter-tabs" aria-label="デモ種別フィルター">
            <button
              className={filter === "all" ? "selected" : ""}
              type="button"
              onClick={() => setFilter("all")}
            >
              すべて
            </button>
            {(Object.keys(demoPatterns) as DemoType[]).map((type) => (
              <button
                className={filter === type ? "selected" : ""}
                type="button"
                key={type}
                onClick={() => setFilter(type)}
              >
                {demoPatterns[type].shortLabel}
              </button>
            ))}
          </div>

          <div className="summary-grid admin-summary-grid">
            <SummaryCard
              icon={<ListChecks size={20} />}
              label="診断回答"
              value={`${diagnoses.length}件`}
            />
            <SummaryCard
              icon={<CalendarDays size={20} />}
              label="予約"
              value={`${reservations.length}件`}
            />
            <SummaryCard
              icon={<IdCard size={20} />}
              label="会員"
              value={`${customers.length}名`}
            />
          </div>

          <section className="admin-grid">
            <StatsCard
              title="業種別の件数"
              icon={<BarChart3 size={20} />}
              counts={industryCounts}
              actionLabel="診断回答をCSV出力"
              onExport={() => exportDiagnoses(diagnoses)}
            />
            <StatsCard
              title="目的別の件数"
              icon={<Users size={20} />}
              counts={goalCounts}
              actionLabel="予約一覧をCSV出力"
              onExport={() => exportReservations(reservations)}
            />
            <StatsCard
              title="デモ種別ごとの件数"
              icon={<FileSpreadsheet size={20} />}
              counts={demoCounts}
              actionLabel="会員一覧をCSV出力"
              onExport={() => exportCustomers(customers)}
            />
          </section>

          <section className="admin-grid">
            <RecordCard title="診断回答一覧">
              {diagnoses.map((diagnosis) => (
                <div className="record-item" key={diagnosis.id}>
                  <strong>{demoPatterns[diagnosis.sourceDemoType].label}</strong>
                  <span>{diagnosis.answers.goal}</span>
                  <p>{diagnosis.answers.issue}</p>
                  <small>{formatDate(diagnosis.createdAt)}</small>
                </div>
              ))}
            </RecordCard>

            <RecordCard title="予約一覧">
              {reservations.map((reservation) => (
                <div className="record-item" key={reservation.id}>
                  <strong>{reservation.name}</strong>
                  <span>{demoPatterns[reservation.sourceDemoType].label}</span>
                  <p>{reservation.consultation}</p>
                  <small>
                    {reservation.email} / {reservation.preferredDateTime}
                  </small>
                </div>
              ))}
            </RecordCard>

            <RecordCard title="会員一覧">
              {customers.map((customer) => (
                <div className="record-item" key={customer.id}>
                  <strong>{customer.lineDisplayName}</strong>
                  <span>{customer.id}</span>
                  <p>
                    {customer.points}pt / 来店{customer.visitCount}回
                  </p>
                  <small>最終来店: {formatDate(customer.lastVisitAt)}</small>
                </div>
              ))}
            </RecordCard>
          </section>
        </section>
      </section>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="summary-card">
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function StatusPill({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="status-pill">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatsCard({
  title,
  icon,
  counts,
  actionLabel,
  onExport
}: {
  title: string;
  icon: React.ReactNode;
  counts: Record<string, number>;
  actionLabel: string;
  onExport: () => void;
}) {
  return (
    <article className="card">
      <div className="section-title-row">
        <div>
          <span className="section-icon">{icon}</span>
          <h2>{title}</h2>
        </div>
        <button
          className="export-button"
          type="button"
          title={actionLabel}
          onClick={onExport}
        >
          <Download size={18} />
          <span>{actionLabel}</span>
        </button>
      </div>
      <StatsList counts={counts} />
    </article>
  );
}

function RecordCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <div className="record-list">{children}</div>
    </article>
  );
}

function StatsList({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts);
  const max = Math.max(...entries.map(([, count]) => count), 1);

  if (!entries.length) {
    return <p className="empty-text">まだデータがありません。</p>;
  }

  return (
    <div className="stats-list">
      {entries.map(([label, count]) => (
        <div className="stats-row" key={label}>
          <div>
            <span>{label}</span>
            <strong>{count}件</strong>
          </div>
          <div className="stats-track">
            <span style={{ width: `${(count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function countBy<T>(items: T[], selector: (item: T) => string) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    const key = selector(item);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}

function filterByDemo<T extends { sourceDemoType: DemoType }>(
  items: T[],
  filter: FilterType
) {
  return filter === "all"
    ? items
    : items.filter((item) => item.sourceDemoType === filter);
}

function mergeById<T extends { id: string }>(primary: T[], secondary: T[]) {
  const map = new Map<string, T>();
  [...primary, ...secondary].forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

function getStorageLabel(mode: AdminData["mode"]) {
  switch (mode) {
    case "supabase":
      return "Supabase";
    case "local":
      return "ローカル保存";
    case "supabase-error":
      return "DB接続エラー";
    default:
      return "モック";
  }
}

function exportDiagnoses(records: DiagnosisRecord[]) {
  const rows = records.map((record) => ({
    id: record.id,
    createdAt: record.createdAt,
    demoType: record.sourceDemoType,
    displayName: record.lineDisplayName,
    lineUserId: record.lineUserId,
    industry: record.answers.industry,
    issue: record.answers.issue,
    goal: record.answers.goal,
    selectedFeatures: record.answers.selectedFeatures.join(" / "),
    recommendedPlan: record.recommendedPlan
  }));
  downloadCsv("diagnoses.csv", rows);
}

function exportReservations(records: ReservationRecord[]) {
  const rows = records.map((record) => ({
    id: record.id,
    createdAt: record.createdAt,
    demoType: record.sourceDemoType,
    name: record.name,
    email: record.email,
    preferredDateTime: record.preferredDateTime,
    consultation: record.consultation,
    lineDisplayName: record.lineDisplayName,
    lineUserId: record.lineUserId
  }));
  downloadCsv("reservations.csv", rows);
}

function exportCustomers(records: CustomerRecord[]) {
  const rows = records.map((record) => ({
    id: record.id,
    createdAt: record.createdAt,
    lineDisplayName: record.lineDisplayName,
    lineUserId: record.lineUserId,
    email: record.email ?? "",
    name: record.name ?? "",
    memberQrCode: record.memberQrCode,
    points: String(record.points),
    visitCount: String(record.visitCount),
    lastVisitAt: record.lastVisitAt ?? ""
  }));
  downloadCsv("customers.csv", rows);
}

function downloadCsv(filename: string, rows: Record<string, string>[]) {
  if (!rows.length) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header] ?? "")).join(",")
    )
  ].join("\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8"
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

function escapeCsv(value: string) {
  return `"${value.replaceAll("\"", "\"\"")}"`;
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
