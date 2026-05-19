"use client";

import {
  ArrowLeft,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardCheck,
  Gift,
  IdCard,
  LineChart,
  MessageCircle,
  Route,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Users
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { demoPatterns, createInitialAnswers } from "@/lib/demoPatterns";
import { createRecommendation } from "@/lib/recommendation";
import { saveDiagnosis, saveReservation } from "@/lib/storage";
import type {
  DemoPattern,
  DemoType,
  DiagnosisAnswers,
  DiagnosisQuestion,
  DiagnosisRecord,
  LiffUser,
  ReservationRecord
} from "@/lib/types";
import { useLiff } from "@/hooks/useLiff";

type Screen = "top" | "diagnosis" | "result" | "reservation" | "complete";

export function DemoApp({
  initialDemo = "store",
  landingTitle,
  landingDescription
}: {
  initialDemo?: DemoType;
  landingTitle?: string;
  landingDescription?: string;
}) {
  const [pattern, setPattern] = useState<DemoPattern>(demoPatterns[initialDemo]);
  const [answers, setAnswers] = useState<DiagnosisAnswers>(
    createInitialAnswers(demoPatterns[initialDemo])
  );
  const [screen, setScreen] = useState<Screen>("top");
  const [currentStep, setCurrentStep] = useState(0);
  const [diagnosisRecord, setDiagnosisRecord] =
    useState<DiagnosisRecord | null>(null);
  const [reservationRecord, setReservationRecord] =
    useState<ReservationRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isReady, error, login, modeLabel } = useLiff();

  const recommendation = useMemo(
    () => createRecommendation(answers, pattern),
    [answers, pattern]
  );
  const activeQuestion = pattern.questions[currentStep];
  const progress = Math.round(((currentStep + 1) / pattern.questions.length) * 100);

  function selectDemo(type: DemoType) {
    const nextPattern = demoPatterns[type];
    setPattern(nextPattern);
    setAnswers(createInitialAnswers(nextPattern));
    setCurrentStep(0);
    setScreen("top");

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/?demo=${type}`);
    }
  }

  function startDiagnosis() {
    setCurrentStep(0);
    setScreen("diagnosis");
  }

  function selectAnswer(question: DiagnosisQuestion, value: string) {
    if (question.id === "selectedFeatures") {
      setAnswers((current) => {
        const exists = current.selectedFeatures.includes(value);
        return {
          ...current,
          selectedFeatures: exists
            ? current.selectedFeatures.filter((item) => item !== value)
            : [...current.selectedFeatures, value]
        };
      });
      return;
    }

    setAnswers((current) => ({
      ...current,
      [question.id]: value
    }));
  }

  function goNext() {
    if (currentStep < pattern.questions.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }

    const record: DiagnosisRecord = {
      id: `diagnosis-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lineUserId: user.userId,
      lineDisplayName: user.displayName,
      sourceDemoType: pattern.id,
      answers,
      recommendedPlan: recommendation.plan.name
    };

    saveDiagnosis(record);
    setDiagnosisRecord(record);
    setScreen("result");

    fetch("/api/diagnosis-answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(record)
    }).catch((apiError) => console.log("[diagnosis api failed]", apiError));
  }

  function goBack() {
    if (screen === "diagnosis" && currentStep > 0) {
      setCurrentStep((step) => step - 1);
      return;
    }

    if (screen === "reservation") {
      setScreen("result");
      return;
    }

    setScreen("top");
  }

  async function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const record: ReservationRecord = {
      id: `reservation-${Date.now()}`,
      createdAt: new Date().toISOString(),
      diagnosisId: diagnosisRecord?.id,
      sourceDemoType: pattern.id,
      lineUserId: user.userId,
      lineDisplayName: user.displayName,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      preferredDateTime: String(formData.get("preferredDateTime") ?? ""),
      consultation: String(formData.get("consultation") ?? ""),
      industry: answers.industry,
      goal: answers.goal
    };

    setIsSubmitting(true);
    saveReservation(record);

    await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(record)
    }).catch((apiError) => console.log("[reservation api failed]", apiError));

    setReservationRecord(record);
    setIsSubmitting(false);
    setScreen("complete");
  }

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="LINE診断予約デモ">
        <header className="line-header">
          <div>
            <span className="eyebrow">LIFF portfolio demo</span>
            <h1>LINE診断予約デモ</h1>
          </div>
          <nav className="header-actions" aria-label="デモ内リンク">
            <Link href="/member-card">会員証</Link>
            <Link href="/line-flow">導線</Link>
            <Link href="/admin">管理</Link>
          </nav>
        </header>

        <UserStrip
          user={user}
          isReady={isReady}
          modeLabel={modeLabel}
          error={error}
          login={login}
        />

        {screen === "top" && (
          <TopScreen
            pattern={pattern}
            selectedDemo={pattern.id}
            recommendation={recommendation}
            landingTitle={landingTitle}
            landingDescription={landingDescription}
            onSelectDemo={selectDemo}
            onStart={startDiagnosis}
          />
        )}

        {screen === "diagnosis" && activeQuestion && (
          <section className="content-stack">
            <button className="text-button" type="button" onClick={goBack}>
              <ArrowLeft size={18} />
              戻る
            </button>

            <div className="progress-card">
              <div className="progress-meta">
                <span>
                  STEP {currentStep + 1} / {pattern.questions.length}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <article className="card">
              <span className="section-icon">
                <ClipboardCheck size={20} />
              </span>
              <h2>{activeQuestion.title}</h2>
              <p>{activeQuestion.caption}</p>
              <OptionGrid
                options={activeQuestion.options}
                selected={getSelectedValues(activeQuestion, answers)}
                multiple={activeQuestion.multiple}
                onSelect={(value) => selectAnswer(activeQuestion, value)}
              />
            </article>

            <button className="primary-button" type="button" onClick={goNext}>
              {currentStep === pattern.questions.length - 1
                ? "診断結果を見る"
                : "次へ"}
              <ChevronRight size={22} />
            </button>
          </section>
        )}

        {screen === "result" && (
          <ResultScreen
            pattern={pattern}
            answers={answers}
            recommendation={recommendation}
            onBack={goBack}
            onReserve={() => setScreen("reservation")}
          />
        )}

        {screen === "reservation" && (
          <ReservationScreen
            pattern={pattern}
            user={user}
            isSubmitting={isSubmitting}
            onBack={goBack}
            onSubmit={submitReservation}
          />
        )}

        {screen === "complete" && (
          <CompleteScreen
            pattern={pattern}
            reservation={reservationRecord}
            onReset={() => setScreen("top")}
          />
        )}
      </section>
    </main>
  );
}

function TopScreen({
  pattern,
  selectedDemo,
  recommendation,
  landingTitle,
  landingDescription,
  onSelectDemo,
  onStart
}: {
  pattern: DemoPattern;
  selectedDemo: DemoType;
  recommendation: ReturnType<typeof createRecommendation>;
  landingTitle?: string;
  landingDescription?: string;
  onSelectDemo: (type: DemoType) => void;
  onStart: () => void;
}) {
  return (
    <section className="content-stack top-screen">
      <DemoWarning />

      <div className="hero-visual" aria-hidden="true">
        <div className="chat-bubble left">{pattern.catchCopy}</div>
        <div className="chat-bubble right">予約・通知・会員化まで自動化</div>
        <div className="rich-menu-preview">
          <span>診断</span>
          <span>予約</span>
          <span>会員証</span>
          <span>クーポン</span>
        </div>
      </div>

      {landingTitle && (
        <article className="card compact-card demo-landing-card">
          <p className="eyebrow">industry demo URL</p>
          <h2>{landingTitle}</h2>
          <p>{landingDescription}</p>
        </article>
      )}

      <article className="hero-copy">
        <span className="pill">
          <Sparkles size={16} />
          {pattern.label}
        </span>
        <h2>{pattern.catchCopy}</h2>
        <p>{pattern.heroMessage}</p>
      </article>

      <DemoSelector selected={selectedDemo} onSelect={onSelectDemo} />

      <button className="primary-button" type="button" onClick={onStart}>
        {pattern.shortLabel}デモを始める
        <ChevronRight size={22} />
      </button>

      <div className="mini-grid">
        <FeatureCard
          icon={<MessageCircle size={20} />}
          title="LIFF診断"
          text="LINE User IDを取得し、業種別の質問に回答"
        />
        <FeatureCard
          icon={<CalendarCheck size={20} />}
          title="予約導線"
          text="診断結果から予約や相談フォームへ自然に誘導"
        />
        <FeatureCard
          icon={<IdCard size={20} />}
          title="QR会員証"
          text="ポイントカードや来店管理案件にも展開可能"
        />
      </div>

      <article className="card compact-card">
        <span className="section-icon">
          <LineChart size={20} />
        </span>
        <h3>この機能は実案件ではこう使えます</h3>
        <p>{recommendation.overview}</p>
      </article>

      <div className="quick-link-grid">
        <Link className="secondary-button" href="/member-card">
          QR会員証を見る
          <IdCard size={20} />
        </Link>
        <Link className="secondary-button" href="/line-flow">
          リッチメニュー導線
          <Route size={20} />
        </Link>
      </div>
    </section>
  );
}

function DemoSelector({
  selected,
  onSelect
}: {
  selected: DemoType;
  onSelect: (type: DemoType) => void;
}) {
  const iconMap = {
    store: <Store size={20} />,
    beauty: <Scissors size={20} />,
    school: <Users size={20} />
  };

  return (
    <section className="demo-selector" aria-label="デモパターン選択">
      {(Object.keys(demoPatterns) as DemoType[]).map((type) => {
        const pattern = demoPatterns[type];
        const active = selected === type;

        return (
          <button
            className={active ? "demo-card selected" : "demo-card"}
            type="button"
            key={type}
            onClick={() => onSelect(type)}
            aria-pressed={active}
          >
            <span className="section-icon">{iconMap[type]}</span>
            <strong>{pattern.label}</strong>
            <small>{pattern.purpose}</small>
          </button>
        );
      })}
    </section>
  );
}

function ResultScreen({
  pattern,
  answers,
  recommendation,
  onBack,
  onReserve
}: {
  pattern: DemoPattern;
  answers: DiagnosisAnswers;
  recommendation: ReturnType<typeof createRecommendation>;
  onBack: () => void;
  onReserve: () => void;
}) {
  return (
    <section className="content-stack">
      <button className="text-button" type="button" onClick={onBack}>
        <ArrowLeft size={18} />
        最初に戻る
      </button>

      <article className="card result-card">
        <span className="section-icon">
          <ShieldCheck size={20} />
        </span>
        <p className="eyebrow">診断結果</p>
        <h2>{recommendation.title}</h2>
        <p>{recommendation.overview}</p>
      </article>

      <article className="card">
        <h3>おすすめ構成</h3>
        <div className="answer-summary">
          <span>{pattern.label}</span>
          <span>{answers.issue}</span>
          <span>{answers.goal}</span>
        </div>
      </article>

      <article className="card">
        <h3>想定導線</h3>
        <ol className="route-list">
          {recommendation.route.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </article>

      <article className="card">
        <h3>必要な機能</h3>
        <div className="tag-list">
          {recommendation.requiredFeatures.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </article>

      <article className="card">
        <h3>導入メリット</h3>
        <ul className="check-list">
          {recommendation.benefits.map((item) => (
            <li key={item}>
              <Check size={18} />
              {item}
            </li>
          ))}
        </ul>
      </article>

      <article className="plan-card">
        <p>概算構築プラン</p>
        <h3>{recommendation.plan.name}</h3>
        <span>{recommendation.plan.summary}</span>
        <strong>{recommendation.plan.priceHint}</strong>
      </article>

      <button className="primary-button" type="button" onClick={onReserve}>
        {pattern.reservationCta}
        <CalendarCheck size={22} />
      </button>
    </section>
  );
}

function ReservationScreen({
  pattern,
  user,
  isSubmitting,
  onBack,
  onSubmit
}: {
  pattern: DemoPattern;
  user: LiffUser;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="content-stack">
      <button className="text-button" type="button" onClick={onBack}>
        <ArrowLeft size={18} />
        診断結果に戻る
      </button>

      <article className="card">
        <span className="section-icon">
          <CalendarCheck size={20} />
        </span>
        <h2>{pattern.reservationCta}</h2>
        <p>
          診断内容、LINE情報、希望日時をまとめて管理者へ通知します。実案件ではここからSlack、Supabase、Google
          Sheets、予約システムへ連携できます。
        </p>
        <DemoWarning />

        <form className="form-stack" onSubmit={onSubmit}>
          <label>
            名前
            <input name="name" type="text" placeholder="デモ 太郎" required />
          </label>
          <label>
            メールアドレス
            <input
              name="email"
              type="email"
              placeholder="demo@example.com"
              required
            />
          </label>
          <label>
            希望日時
            <input name="preferredDateTime" type="datetime-local" required />
          </label>
          <label>
            相談内容
            <textarea
              name="consultation"
              placeholder="デモ入力例: LINEから予約を増やしたい、会員証も使いたい等"
              rows={4}
              required
            />
          </label>
          <label>
            LINE表示名 / LINE User ID
            <input type="text" value={`${user.displayName} / ${user.userId}`} readOnly />
          </label>

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "予約リクエストを送信"}
            <Send size={20} />
          </button>
        </form>
      </article>
    </section>
  );
}

function CompleteScreen({
  pattern,
  reservation,
  onReset
}: {
  pattern: DemoPattern;
  reservation: ReservationRecord | null;
  onReset: () => void;
}) {
  return (
    <section className="content-stack complete-screen">
      <article className="card result-card">
        <span className="complete-icon">
          <Check size={34} />
        </span>
        <h2>{pattern.completionMessage}</h2>
        <p>管理者に通知されました</p>
        <p>回答内容は管理画面で確認できます</p>
        <p>
          この予約情報は管理画面、Slack通知、Supabase保存、CSV出力に反映されます。
        </p>
      </article>

      {reservation && (
        <article className="card compact-card">
          <h3>送信内容</h3>
          <dl className="detail-list">
            <div>
              <dt>お名前</dt>
              <dd>{reservation.name}</dd>
            </div>
            <div>
              <dt>希望日時</dt>
              <dd>{reservation.preferredDateTime}</dd>
            </div>
            <div>
              <dt>通知</dt>
              <dd>Slack未設定時はモック通知としてconsole.logに出力</dd>
            </div>
          </dl>
        </article>
      )}

      <Link className="primary-button" href="/admin">
        管理画面で確認する
        <Users size={20} />
      </Link>
      <Link className="secondary-button" href="/member-card">
        QR会員証を見る
        <Gift size={20} />
      </Link>
      <button className="primary-button" type="button" onClick={onReset}>
        別のデモを見る
        <ChevronRight size={20} />
      </button>
    </section>
  );
}

function UserStrip({
  user,
  isReady,
  modeLabel,
  error,
  login
}: {
  user: LiffUser;
  isReady: boolean;
  modeLabel: string;
  error?: string;
  login?: () => void;
}) {
  return (
    <div className="user-strip">
      <div className="avatar" aria-hidden="true">
        {user.displayName.slice(0, 1)}
      </div>
      <div>
        <strong>{isReady ? user.displayName : "LINE情報を確認中"}</strong>
        <span className={`liff-state ${user.liffStatus}`}>
          {getLiffStateLabel(user.liffStatus)}
        </span>
        <span>{error ?? modeLabel}</span>
      </div>
      {login && user.liffStatus === "loginRequired" && (
        <button className="mini-button" type="button" onClick={login}>
          LINEログイン
        </button>
      )}
    </div>
  );
}

function DemoWarning() {
  return (
    <div className="demo-warning" role="note">
      ポートフォリオ用デモです。実際の個人情報は入力しないでください。
    </div>
  );
}

function getLiffStateLabel(status: LiffUser["liffStatus"]) {
  switch (status) {
    case "connected":
      return "LINEログイン済み";
    case "loginRequired":
      return "LIFF設定済み・未ログイン";
    case "error":
      return "LIFFエラー・モック表示";
    default:
      return "LIFF未設定・デモ表示";
  }
}

function OptionGrid({
  options,
  selected,
  multiple = false,
  onSelect
}: {
  options: readonly string[];
  selected: readonly string[];
  multiple?: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="option-grid">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            className={isSelected ? "option-button selected" : "option-button"}
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            aria-pressed={isSelected}
          >
            <span>{option}</span>
            {isSelected && <Check size={18} />}
            {multiple && !isSelected && <span className="plus-mark">+</span>}
          </button>
        );
      })}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="feature-card">
      <span>{icon}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function getSelectedValues(
  question: DiagnosisQuestion,
  answers: DiagnosisAnswers
) {
  if (question.id === "selectedFeatures") {
    return answers.selectedFeatures;
  }

  return [answers[question.id]];
}
