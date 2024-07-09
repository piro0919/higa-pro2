"use client";
import { motion } from "framer-motion";
import Hamburger from "hamburger-react";
import i18next from "i18next";
import { Jost } from "next/font/google";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import Drawer from "react-modern-drawer";
import { Link } from "react-scroll";
import { SocialIcon } from "react-social-icons";
import { ToastContainer } from "react-toastify";
import useShowWindowSize from "use-show-window-size";
import { useBoolean, useWindowSize } from "usehooks-ts";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/ja/zod.json";
import { useShallow } from "zustand/react/shallow";
import styles from "./style.module.scss";
import useHeaderStore from "@/stores/useHeaderStore";

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
  const { height } = useWindowSize();
  const [loadedIndexList, setLoadedIndexList] = useState<number[]>([]);
  const { header, loaded, setLoaded } = useHeaderStore(
    useShallow((state) => ({
      header: state.header,
      loaded: state.loaded,
      setLoaded: state.setLoaded,
    })),
  );
  const [talentItems, setTalentItems] = useState<ReactNode[]>([]);
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
  const pathname = usePathname();
  const paths = useMemo(
    () => [
      {
        title: "TOP",
        to: "top",
      },
      {
        title: "ABOUT",
        to: "about",
      },
      {
        title: "NEWS",
        to: "news",
      },
      {
        title: "TALENT",
        to: "talent",
      },
      {
        title: "MANAGER",
        to: "manager",
      },
      {
        title: "CONTACT",
        to: "contact",
      },
    ],
    [],
  );
  const {
    setFalse: offIsOpen,
    toggle: toggleDrawer,
    value: isOpen,
  } = useBoolean(false);

  useShowWindowSize({
    disable: process.env.NODE_ENV === "production",
  });

  useEffect(() => {
    setLoaded(loadedIndexList.length / talents.length === 1);
  }, [loadedIndexList.length, setLoaded, talents.length]);

  useEffect(() => {
    if (height === 0) {
      return;
    }

    setTalentItems(
      talents.map(({ id, images: [{ url }] }, index) => (
        <div className={styles.item} key={id}>
          <motion.div
            animate={{
              transform: `translate(${loaded ? "0" : "-200%"}, 0)`,
            }}
            className={styles.imageWrapper}
            initial={{ transform: "translate(-200%, 0)" }}
            transition={{
              delay: 0.1 * index + 0.75,
              duration: 1,
              ease: "backOut",
            }}
          >
            {
              <Image
                alt={id}
                className={styles.image}
                fill={true}
                loading="eager"
                onLoad={() => {
                  setLoadedIndexList((prevLoadedIndexList) =>
                    prevLoadedIndexList.includes(index)
                      ? prevLoadedIndexList
                      : [...prevLoadedIndexList, index],
                  );
                }}
                quality={100}
                src={`${url}?fit=max&h=${height}`}
              />
            }
          </motion.div>
        </div>
      )),
    );
  }, [height, loaded, talents]);

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header} id="top">
          {headerItems}
          {header}
        </header>
        <aside className={styles.aside}>
          <div className={`${styles.inner} pattern-cross-dots-lg`}>
            <nav>
              <ul className={styles.list}>
                {paths.map(({ title, to }) => (
                  <li key={to}>
                    {pathname === "/" ? (
                      <Link
                        activeClass={styles.active}
                        className={`${styles.link} ${jost.className}`}
                        hashSpy={true}
                        spy={true}
                        to={to}
                      >
                        {title}
                      </Link>
                    ) : (
                      <NextLink
                        className={`${styles.link} ${jost.className}`}
                        href={`/#${to}`}
                      >
                        {title}
                      </NextLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.iconWrapper}>
              <SocialIcon
                className={styles.icon}
                target="_blank"
                url="https://x.com/HIGA_pro_0608"
              />
            </div>
          </div>
          <div
            className={`${styles.inner2} pattern-cross-dots-lg`}
            onClick={() => toggleDrawer()}
          >
            <Hamburger color="#fff" size={30} toggled={isOpen} />
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
      <ToastContainer
        autoClose={5000}
        closeOnClick={true}
        hideProgressBar={false}
        pauseOnHover={false}
        position="bottom-left"
      />
      <ProgressBar />
      <motion.div
        animate={
          loaded
            ? {
                opacity: 0,
                transitionEnd: {
                  display: "none",
                },
              }
            : {
                opacity: 1,
              }
        }
        className={`${styles.loadingWrapper} pattern-cross-dots-lg`}
        initial={{ opacity: 1 }}
        transition={{
          delay: 1,
          duration: 1,
        }}
      >
        <CircularProgressbar
          className={styles.circularProgressbar}
          styles={{
            text: {
              fill: "fff",
            },
            trail: {
              stroke: "#fff",
            },
          }}
          text={`${Math.ceil((loadedIndexList.length / talents.length) * 100)}%`}
          value={(loadedIndexList.length / talents.length) * 100}
        />
      </motion.div>
      <Drawer
        className={`${styles.drawer} pattern-cross-dots-lg`}
        direction="top"
        onClose={toggleDrawer}
        open={isOpen}
      >
        <nav>
          <ul className={styles.list}>
            {paths.map(({ title, to }) => (
              <li key={to}>
                {pathname === "/" ? (
                  <Link
                    className={`${styles.link} ${jost.className}`}
                    hashSpy={true}
                    onClick={() => offIsOpen()}
                    spy={true}
                    to={to}
                  >
                    {title}
                  </Link>
                ) : (
                  <NextLink
                    className={`${styles.link} ${jost.className}`}
                    href={`/#${to}`}
                    onClick={() => offIsOpen()}
                  >
                    {title}
                  </NextLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>
    </>
  );
}
