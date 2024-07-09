// eslint-disable-next-line filenames/match-exported
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { shuffle } from "fast-shuffle";
import type { Metadata } from "next";
import { M_PLUS_1 as MPlus1 } from "next/font/google";
import "overlayscrollbars/overlayscrollbars.css";
import "pattern.css";
import "react-circular-progressbar/dist/styles.css";
import "react-modern-drawer/dist/index.css";
import "react-toastify/dist/ReactToastify.css";
import "ress";
import "./globals.scss";
import Layout from "@/components/Layout";
import client from "@/lib/client";

export const metadata: Metadata = {
  description:
    "Vライバー配信アプリIRIAM（イリアム）の事務所「Higa Production（ヒガプロダクション）」の公式サイトです。",
  title: {
    default: "Higa Production（ヒガプロダクション）公式サイト",
    template: "%s - Higa Production（ヒガプロダクション）公式サイト",
  },
};

const zenKakuGothicNew = MPlus1({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

dayjs.locale("ja");

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  const { contents: talentsContents } = await client.getList({
    customRequestInit: {
      next: {
        // 24 時間ごと
        revalidate: 86400,
      },
    },
    endpoint: "talents",
    queries: {
      fields: ["id", "images"],
      filters: "images[exists]",
      limit: 100,
    },
  });

  return (
    <html lang="ja">
      <body className={zenKakuGothicNew.className}>
        <Layout talents={shuffle(talentsContents)}>{children}</Layout>
      </body>
    </html>
  );
}
