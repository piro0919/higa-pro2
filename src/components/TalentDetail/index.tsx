"use client";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  Jost,
  M_PLUS_1 as MPlus1,
  Mochiy_Pop_P_One as MochiyPopPOne,
  Raleway,
} from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import queryString from "query-string";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { SocialIcon } from "react-social-icons";
import sortArray from "sort-array";
import Typewriter from "typewriter-effect";
import { useBoolean, useSessionStorage, useWindowSize } from "usehooks-ts";
import { useShallow } from "zustand/react/shallow";
import styles from "./style.module.scss";
import useHeaderStore from "@/stores/useHeaderStore";

const jost = Jost({ subsets: ["latin"], weight: "700" });
const mPlus1 = MPlus1({ subsets: ["latin"], weight: "700" });
const mochiyPopPOne = MochiyPopPOne({ subsets: ["latin"], weight: "400" });
const raleway = Raleway({ subsets: ["latin"], weight: "800" });

type Talent = {
  debut: string;
  furigana: string;
  id: string;
  imageUrl?: string;
  name: string;
};

export type TalentDetailProps = {
  debut: string;
  imageUrl: string;
  iriamUrl: string;
  name: string;
  profile: string;
  selectedDebut?: string;
  talentId: string;
  talents: Talent[];
  twitterUrl: string;
};

export default function TalentDetail({
  debut,
  imageUrl,
  iriamUrl,
  name,
  profile,
  selectedDebut,
  talentId,
  talents,
  twitterUrl,
}: TalentDetailProps): JSX.Element {
  const talentDebutList = useMemo(
    () =>
      Array.from(
        new Set(
          sortArray(talents, { by: "debut", order: "asc" }).map(({ debut }) =>
            dayjs(debut).format("YYYY-MM"),
          ),
        ),
      ),
    [talents],
  );
  const talentDebut = useMemo(() => {
    if (typeof selectedDebut === "string") {
      return selectedDebut;
    }

    const talent = talents.find(({ id }) => talentId === id);

    // 入り得ない
    if (!talent) {
      throw new Error("talent not found");
    }

    return dayjs(talent.debut).format("YYYY-MM");
  }, [selectedDebut, talentId, talents]);
  const { loaded: headerLoaded, setHeader } = useHeaderStore(
    useShallow((state) => ({
      loaded: state.loaded,
      setHeader: state.setHeader,
    })),
  );
  const { height } = useWindowSize();
  const { setTrue: onLoaded, value: loaded } = useBoolean(false);
  const [isFirstRenderd, setIsFirstRenderd] = useSessionStorage(
    "isFirstRenderd",
    false,
  );
  const { inView, ref } = useInView({
    rootMargin: "-25% 0px -25% 0px",
    triggerOnce: true,
  });

  useEffect(() => {
    if (!headerLoaded) {
      setIsFirstRenderd(false);

      return;
    }

    setTimeout(() => setIsFirstRenderd(true), 1250);
  }, [headerLoaded, setIsFirstRenderd]);

  useEffect(() => {
    setHeader(
      isFirstRenderd ? (
        <div
          className={`${styles.talentWrapper} pattern-cross-dots-lg`}
          key={talentId}
        >
          <motion.div
            animate={{
              opacity: loaded ? 1 : 0,
              transform: `translate(${loaded ? "0dvw" : "25dvw"}, 0)`,
            }}
            className={styles.imageWrapper}
            initial={{ opacity: 0, transform: "translate(25dvw, 0)" }}
            transition={{
              duration: 0.75,
              ease: "backOut",
            }}
          >
            {
              <Image
                alt={name}
                className={styles.image}
                fill={true}
                loading="eager"
                onLoad={() => onLoaded()}
                quality={100}
                src={`${imageUrl}?fit=max&h=${height * 2}`}
              />
            }
          </motion.div>
          <div className={`${styles.detailWrapper} pattern-grid-md`}>
            <div className={styles.inner}>
              <motion.div
                animate={{ opacity: 1, transform: "translate(0, 0%)" }}
                className={styles.h1Wrapper}
                initial={{ opacity: 0, transform: "translate(0, 100%)" }}
                transition={{
                  delay: 0.1,
                  duration: 0.75,
                  ease: (x: number): number => 1 - Math.pow(1 - x, 4),
                }}
              >
                <h1 className={`${styles.h1} ${mochiyPopPOne.className}`}>
                  {name}
                </h1>
              </motion.div>
              <OverlayScrollbarsComponent>
                <div className={`${styles.profile} ${mPlus1.className}`}>
                  <Typewriter
                    onInit={(typewriter): void => {
                      typewriter.typeString(profile).start();
                    }}
                    options={{
                      delay: 25,
                      loop: false,
                    }}
                  />
                </div>
              </OverlayScrollbarsComponent>
              <div className={styles.sideWrapper}>
                <div className={styles.linksWrapper}>
                  <motion.a
                    animate={{
                      transform: "scale(1)",
                    }}
                    className={`${styles.link} pattern-cross-dots-lg`}
                    href={iriamUrl}
                    initial={{ transform: "scale(0)" }}
                    target="_blank"
                    transition={{
                      duration: 0.75,
                      ease: "backOut",
                    }}
                  >
                    <div className={styles.imageWrapper2}>
                      <Image alt="IRIAM" fill={true} src="/iriam.jpg" />
                    </div>
                    <span className={jost.className}>IRIAM</span>
                  </motion.a>
                  <motion.a
                    animate={{
                      transform: "scale(1)",
                    }}
                    className={`${styles.link} pattern-cross-dots-lg`}
                    href={twitterUrl.replace("twitter", "x")}
                    initial={{ transform: "scale(0)" }}
                    target="_blank"
                    transition={{
                      delay: 0.1,
                      duration: 0.75,
                      ease: "backOut",
                    }}
                  >
                    <SocialIcon
                      className={styles.icon}
                      target="_blank"
                      url={twitterUrl.replace("twitter", "x")}
                    />
                    <span className={jost.className}>X</span>
                  </motion.a>
                </div>
                <div className={styles.textsWrapper}>
                  <div className={styles.debut}>
                    <Typewriter
                      onInit={(typewriter): void => {
                        typewriter
                          .typeString(
                            `デビュー日：${dayjs(debut).format("YYYY.M.D")}`,
                          )
                          .start();
                      }}
                      options={{
                        delay: 25,
                        loop: false,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null,
    );
  }, [
    debut,
    headerLoaded,
    height,
    imageUrl,
    iriamUrl,
    isFirstRenderd,
    loaded,
    name,
    onLoaded,
    profile,
    setHeader,
    setIsFirstRenderd,
    talentId,
    twitterUrl,
  ]);

  return (
    <article
      className={`${styles.article} pattern-zigzag-lg`}
      data-article="talent"
      id="talent"
      ref={ref}
    >
      <div className={styles.inner}>
        <motion.div
          className={styles.h2Wrapper}
          initial={{ width: 0 }}
          transition={{ duration: 0.5, ease: "circInOut" }}
          viewport={{ once: true }}
          whileInView={{ width: "100%" }}
        >
          <h2 className={`${styles.h2} ${raleway.className}`}>TALENT</h2>
        </motion.div>
        <div className={styles.content}>
          <ul className={styles.list}>
            {talentDebutList.map((debut) => (
              <li
                className={`${styles.item} pattern-cross-dots-lg`}
                key={debut}
              >
                <Link
                  className={`${styles.link} ${jost.className} ${debut === talentDebut ? styles.active : ""}`}
                  href={`${queryString.stringifyUrl({
                    query: {
                      debut,
                    },
                    url: `/talents/${talentId}`,
                  })}#talent`}
                >
                  {debut
                    .split("-")
                    .map((v) => parseInt(v, 10))
                    .join(".")}
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.list2}>
            {sortArray(
              talents.filter(
                ({ debut }) => talentDebut === dayjs(debut).format("YYYY-MM"),
              ),
              { by: "furigana" },
            ).map(
              ({ furigana, id, imageUrl = "/no-image.png", name }, index) => (
                <motion.li
                  animate={{
                    opacity: isFirstRenderd && inView ? 1 : 0,
                    transform: `translate(${isFirstRenderd && inView ? 0 : 50}%, ${
                      isFirstRenderd && inView ? 0 : 50
                    }%)`,
                  }}
                  className={`${styles.item2} pattern-grid-md`}
                  initial={{ opacity: 0, transform: "translate(50%, 50%)" }}
                  key={id}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.75,
                    ease: "backOut",
                  }}
                >
                  <Link href={`/talents/${id}#top`}>
                    <motion.div
                      animate={{
                        opacity: isFirstRenderd && inView ? 1 : 0,
                      }}
                      className={styles.name}
                      initial={{
                        opacity: 0,
                      }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.75,
                      }}
                    >
                      {name}
                    </motion.div>
                    <div className={styles.imageWrapper}>
                      <motion.div
                        animate={{
                          opacity: isFirstRenderd && inView ? 1 : 0,
                          transform: `translate(${isFirstRenderd && inView ? 0 : 50}%, ${
                            isFirstRenderd && inView ? 0 : 50
                          }%)`,
                        }}
                        className={styles.imageWrapper2}
                        initial={{
                          opacity: 0,
                          transform: "translate(50%, 50%)",
                        }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.75,
                          ease: "backOut",
                        }}
                      >
                        <Image
                          alt={name}
                          className={styles.image}
                          fill={true}
                          quality={100}
                          src={`${imageUrl}?fit=max&h=1000`}
                          style={
                            imageUrl === "/no-image.png"
                              ? {
                                  objectFit: "contain",
                                }
                              : {
                                  objectFit: "cover",
                                }
                          }
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      animate={{
                        opacity: isFirstRenderd && inView ? 1 : 0,
                      }}
                      className={styles.furigana}
                      initial={{
                        opacity: 0,
                      }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.75,
                      }}
                    >
                      {furigana}
                    </motion.div>
                  </Link>
                </motion.li>
              ),
            )}
          </ul>
        </div>
      </div>
    </article>
  );
}
