"use client";
import { motion } from "framer-motion";
import i18next from "i18next";
import { Jost } from "next/font/google";
import Image from "next/image";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ReactNode, useMemo } from "react";
import { Link } from "react-scroll";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/ja/zod.json";
import styles from "./style.module.scss";

void i18next.init({
  lng: "ja",
  resources: {
    ja: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);

const jost = Jost({ subsets: ["latin"], weight: "700" });

type Image = {
  height: number;
  url: string;
  width: number;
};

type Talent = {
  id: string;
  images: Image[];
};

export type LayoutProps = {
  children: ReactNode;
  talents: Talent[];
};

export default function Layout({
  children,
  talents,
}: LayoutProps): JSX.Element {
  const talentItems = useMemo(
    () =>
      talents.map(({ id, images: [{ url }] }, index) => (
        <div className={styles.item} key={id}>
          <motion.div
            animate={{
              transform: "translate(0, 0)",
            }}
            className={styles.imageWrapper}
            initial={{ transform: "translate(-200%, 0)" }}
            transition={{
              delay: 0.1 * index,
              duration: 1,
              ease: "backOut",
            }}
          >
            <Image
              alt={id}
              className={styles.image}
              fill={true}
              loading="eager"
              quality={100}
              src={url}
            />
          </motion.div>
        </div>
      )),
    [talents],
  );
  const headerItems = useMemo(
    () =>
      Array.from({ length: 2 }, (_, index) => (
        <motion.div
          animate={{ transform: "translate(-100%, 0)" }}
          className={styles.list}
          initial={{ transform: "translate(0, 0)" }}
          key={index}
          style={{
            gridTemplateColumns: `repeat(${talentItems.length}, min(180px, 30dvw))`,
          }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          {talentItems}
        </motion.div>
      )),
    [talentItems],
  );

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header} id="top">
          {headerItems}
          <div className={`${styles.logoWrapper} pattern-cross-dots-lg`}>
            <div className={styles.logoWrapper2}>
              <motion.div
                animate={{ opacity: 1 }}
                className={styles.logoWrapper3}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "linear" }}
              >
                <Image
                  alt="Higa Production"
                  fill={true}
                  quality={100}
                  src="/logo.png"
                />
              </motion.div>
            </div>
          </div>
        </header>
        <aside className={styles.aside}>
          <div className={`${styles.inner} pattern-cross-dots-lg`}>
            <nav>
              <ul className={styles.list}>
                <li>
                  <Link
                    activeClass={styles.active}
                    className={`${styles.link} ${jost.className}`}
                    hashSpy={true}
                    spy={true}
                    to="top"
                  >
                    TOP
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass={styles.active}
                    className={`${styles.link} ${jost.className}`}
                    hashSpy={true}
                    spy={true}
                    to="about"
                  >
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass={styles.active}
                    className={`${styles.link} ${jost.className}`}
                    hashSpy={true}
                    spy={true}
                    to="news"
                  >
                    NEWS
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass={styles.active}
                    className={`${styles.link} ${jost.className}`}
                    hashSpy={true}
                    spy={true}
                    to="talent"
                  >
                    TALENT
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass={styles.active}
                    className={`${styles.link} ${jost.className}`}
                    hashSpy={true}
                    spy={true}
                    to="manager"
                  >
                    MANAGER
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass={styles.active}
                    className={`${styles.link} ${jost.className}`}
                    hashSpy={true}
                    spy={true}
                    to="contact"
                  >
                    CONTACT
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <main>{children}</main>
        <footer className={`${styles.footer} pattern-cross-dots-lg`}>
          <Image
            alt="Higa Production"
            height={320}
            quality={100}
            src="/logo.png"
            width={320}
          />
          <div className={styles.copyright}>
            &copy; 2023 合同会社DreamGarage
          </div>
        </footer>
      </div>
      <ProgressBar />
    </>
  );
}
