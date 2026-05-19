import { ClipboardList, ExternalLink, IdCard, Store } from "lucide-react";
import Link from "next/link";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "https://your-project.vercel.app";

const linkItems = [
  {
    label: "診断トップ",
    path: "/",
    purpose: "共通の診断予約デモ。リッチメニューのメインボタン向け。"
  },
  {
    label: "店舗向けデモ",
    path: "/demo/store",
    purpose: "来店予約、クーポン、会員証、ポイントカードを見せるURL。"
  },
  {
    label: "美容室向けデモ",
    path: "/demo/beauty",
    purpose: "髪のお悩み診断からおすすめメニュー、予約へ誘導するURL。"
  },
  {
    label: "スクール向けデモ",
    path: "/demo/school",
    purpose: "学習目的診断から講座提案、無料相談へ誘導するURL。"
  },
  {
    label: "会員証",
    path: "/member-card",
    purpose: "QR会員証、ポイント、来店回数を見せるURL。"
  },
  {
    label: "LINE導線説明",
    path: "/line-flow",
    purpose: "友だち追加からLIFF、予約、通知までの流れを説明するURL。"
  }
];

export default function LineLinksPage() {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  const liffUrl = liffId
    ? `https://liff.line.me/${liffId}`
    : "https://liff.line.me/{LIFF_ID}";

  return (
    <main className="app-shell flow-shell">
      <section className="flow-page" aria-label="リッチメニュー用リンク一覧">
        <header className="line-header flow-header">
          <div>
            <span className="eyebrow">LINE rich menu links</span>
            <h1>リッチメニュー用リンク一覧</h1>
          </div>
          <nav className="header-actions" aria-label="デモ内リンク">
            <Link href="/">診断</Link>
            <Link href="/member-card">会員証</Link>
            <Link href="/line-flow">導線</Link>
            <Link href="/admin">管理</Link>
          </nav>
        </header>

        <section className="flow-hero">
          <article>
            <span className="pill">
              <Store size={16} />
              LINE公式アカウント設定用
            </span>
            <h2>リッチメニューに設定するURLをまとめて確認できます</h2>
            <p>
              まずVercel URLをLIFF Endpoint URLとして登録します。LINE DevelopersでLIFF IDが発行されたら、
              リッチメニューのリンク先にはLIFF URLを設定します。
            </p>
          </article>

          <article className="card">
            <span className="section-icon">
              <IdCard size={20} />
            </span>
            <h2>メインLIFF URL</h2>
            <p>診断トップ用のLIFF URLです。LIFF ID設定後にこの形式で使います。</p>
            <div className="link-copy-row">
              <label htmlFor="main-liff-url">LINEリッチメニュー登録先</label>
              <input id="main-liff-url" type="text" value={liffUrl} readOnly />
            </div>
          </article>
        </section>

        <section className="flow-note">
          <h2>Vercel Endpoint URL一覧</h2>
          <p>
            下記URLをLIFF Endpoint URL、または営業デモ用の直接共有URLとして使えます。業種別ボタンをLIFFで分けたい場合は、
            LINE DevelopersでLIFFアプリを複数作り、それぞれのEndpoint URLに設定してください。
          </p>
          <div className="link-copy-list">
            {linkItems.map((item) => {
              const url = `${appUrl}${item.path === "/" ? "" : item.path}`;

              return (
                <div className="link-copy-row" key={item.label}>
                  <label htmlFor={`link-${item.path}`}>
                    {item.label}
                    <ExternalLink size={14} aria-hidden="true" />
                  </label>
                  <input id={`link-${item.path}`} type="text" value={url} readOnly />
                  <p>{item.purpose}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flow-note">
          <h2>実案件での使い分け</h2>
          <p>
            ユーザーには診断、予約、会員証などのLINE内画面を案内します。管理画面はスタッフや発注者が確認する営業デモ用URLとして共有し、
            本番案件では認証を付けて一般ユーザーには見せません。
          </p>
          <Link className="secondary-button" href="/admin">
            管理画面の見え方を確認
            <ClipboardList size={20} />
          </Link>
        </section>
      </section>
    </main>
  );
}
