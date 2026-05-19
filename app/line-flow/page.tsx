import {
  Bell,
  ClipboardList,
  Gift,
  IdCard,
  MessageCircle,
  MousePointerClick,
  QrCode,
  Smartphone,
  UserPlus
} from "lucide-react";
import Link from "next/link";

const flowSteps = [
  {
    title: "友だち追加",
    text: "ユーザーがLINE公式アカウントを友だち追加します。",
    icon: <UserPlus size={22} />
  },
  {
    title: "あいさつメッセージ",
    text: "登録直後に、診断やクーポンを案内します。",
    icon: <MessageCircle size={22} />
  },
  {
    title: "リッチメニューをタップ",
    text: "「診断する」「予約する」「会員証」を大きく配置します。",
    icon: <MousePointerClick size={22} />
  },
  {
    title: "LIFFアプリ起動",
    text: "LINE内ブラウザで診断フォームや会員証を開きます。",
    icon: <Smartphone size={22} />
  },
  {
    title: "診断フォーム回答",
    text: "目的や悩みに合わせて、案内内容を出し分けます。",
    icon: <ClipboardList size={22} />
  },
  {
    title: "予約・会員証へ誘導",
    text: "結果に応じて予約、クーポン、QR会員証へつなげます。",
    icon: <IdCard size={22} />
  },
  {
    title: "管理者へSlack通知",
    text: "新規予約や相談内容をスタッフへ即時通知します。",
    icon: <Bell size={22} />
  },
  {
    title: "Supabaseで確認",
    text: "回答、予約、会員情報を管理画面で確認できます。",
    icon: <QrCode size={22} />
  }
];

export default function LineFlowPage() {
  return (
    <main className="app-shell flow-shell">
      <section className="flow-page" aria-label="リッチメニューからLIFFへの導線">
        <header className="line-header flow-header">
          <div>
            <span className="eyebrow">rich menu to LIFF</span>
            <h1>リッチメニューからLIFFへ遷移する流れ</h1>
          </div>
          <nav className="header-actions" aria-label="デモ内リンク">
            <Link href="/">診断</Link>
            <Link href="/member-card">会員証</Link>
            <Link href="/admin">管理</Link>
          </nav>
        </header>

        <section className="flow-hero">
          <div className="line-phone-mock" aria-hidden="true">
            <div className="line-talk">
              <span>友だち追加ありがとうございます。</span>
              <strong>30秒診断でおすすめプランを確認できます。</strong>
            </div>
            <div className="rich-menu-large">
              <span>診断する</span>
              <span>予約する</span>
              <span>会員証</span>
              <span>クーポン</span>
              <span>店舗情報</span>
              <span>相談</span>
            </div>
          </div>
          <article>
            <span className="pill">
              <Gift size={16} />
              発注者に伝わる導線説明
            </span>
            <h2>LINE公式アカウントから、診断・予約・会員化まで迷わず進めます</h2>
            <p>
              このページは、非エンジニアの発注者に「リッチメニューを押すと何が起こるのか」を説明するための図解です。
            </p>
          </article>
        </section>

        <section className="flow-grid">
          {flowSteps.map((step, index) => (
            <article className="flow-step" key={step.title}>
              <span className="flow-number">{index + 1}</span>
              <span className="section-icon">{step.icon}</span>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </article>
          ))}
        </section>

        <section className="flow-note">
          <h2>実案件での使い方</h2>
          <p>
            リッチメニューの「診断する」にLIFF URLを設定します。LIFFアプリ内でLINE User
            IDを取得し、診断回答、予約、会員証を同じユーザー情報にひもづけることで、配信だけで終わらない顧客導線を作れます。
          </p>
        </section>
      </section>
    </main>
  );
}
