"use client";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Jost, M_PLUS_1 as MPlus1, Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import queryString from "query-string";
import { useEffect, useMemo } from "react";
import { SocialIcon } from "react-social-icons";
import sortArray from "sort-array";
import Typewriter from "typewriter-effect";
import { useShallow } from "zustand/react/shallow";
import styles from "./style.module.scss";
import useHeaderStore from "@/stores/useHeaderStore";

const jost = Jost({ subsets: ["latin"], weight: "700" });
const mPlus1 = MPlus1({ subsets: ["latin"], weight: "700" });
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
  const { setHeader } = useHeaderStore(
    useShallow(({ setHeader }) => ({ setHeader })),
  );

  useEffect(() => {
    setHeader(
      <div className={`${styles.talentWrapper} pattern-cross-dots-lg`}>
        <div className={styles.imageWrapper}>
          <Image
            alt={name}
            className={styles.image}
            fill={true}
            quality={100}
            src={imageUrl}
          />
        </div>
        <div className={`${styles.detailWrapper} pattern-grid-md`}>
          <div className={styles.inner}>
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
                <a
                  className={`${styles.link} pattern-cross-dots-lg`}
                  href={iriamUrl}
                  target="_blank"
                >
                  <div className={styles.imageWrapper2}>
                    <Image alt="IRIAM" fill={true} src="/iriam.jpg" />
                  </div>
                  <span className={jost.className}>IRIAM</span>
                </a>
                <a
                  className={`${styles.link} pattern-cross-dots-lg`}
                  href={twitterUrl.replace("twitter", "x")}
                  target="_blank"
                >
                  <SocialIcon
                    className={styles.icon}
                    target="_blank"
                    url={twitterUrl.replace("twitter", "x")}
                  />
                  <span className={jost.className}>X</span>
                </a>
              </div>
              <div className={styles.textsWrapper}>
                <div
                  className={styles.debut}
                >{`デビュー日：${dayjs(debut).format("YYYY.M.D")}`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>,
    );
  }, [debut, imageUrl, iriamUrl, name, profile, setHeader, twitterUrl]);

  return (
    <article
      className={`${styles.article} pattern-zigzag-lg`}
      data-article="talent"
      id="talent"
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
            ).map(({ furigana, id, imageUrl = "/no-image.png", name }) => (
              <li className={`${styles.item2} pattern-grid-md`} key={id}>
                <Link href={`/talents/${id}#top`}>
                  <div className={styles.name}>{name}</div>
                  <div className={styles.imageWrapper}>
                    <div className={styles.imageWrapper2}>
                      <Image
                        alt={name}
                        className={styles.image}
                        fill={true}
                        loading="eager"
                        quality={100}
                        src={imageUrl}
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
                    </div>
                  </div>
                  <div className={styles.furigana}>{furigana}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
