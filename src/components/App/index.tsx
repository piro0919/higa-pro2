"use client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import NoSSR from "@mpth/react-no-ssr";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { Jost, Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useMemo, useRef } from "react";
import { useCollapse } from "react-collapsed";
import { Form, useForm } from "react-hook-form";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import Spacer from "react-spacer";
import TextareaAutosize from "react-textarea-autosize";
import { Id, toast } from "react-toastify";
import sortArray from "sort-array";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import styles from "./style.module.scss";
import useHeaderStore from "@/stores/useHeaderStore";

const jost = Jost({ subsets: ["latin"], weight: "700" });
const raleway = Raleway({ subsets: ["latin"], weight: "800" });
const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
  name: z.string().min(1),
  subject: z.string().min(1),
});

type FieldTypes = z.infer<typeof schema>;

type News = {
  content: string;
  createdAt: string;
  id: string;
  title: string;
};

type Talent = {
  debut: string;
  furigana: string;
  id: string;
  imageUrl?: string;
  name: string;
};

type Manager = {
  debut: string;
  furigana: string;
  id: string;
  imageUrl?: string;
  name: string;
};

export type AppProps = {
  debut?: string;
  managerList: Manager[];
  newsList: News[];
  talents: Talent[];
  type?: string;
};

export default function App({
  debut,
  managerList,
  newsList,
  talents,
  type,
}: AppProps): JSX.Element {
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
  const talentDebut = useMemo(
    () =>
      type === "talent" ? debut ?? talentDebutList[0] : talentDebutList[0],
    [debut, talentDebutList, type],
  );
  const managerDebutList = useMemo(
    () =>
      Array.from(
        new Set(
          sortArray(managerList, { by: "debut", order: "asc" }).map(
            ({ debut }) => dayjs(debut).format("YYYY-MM"),
          ),
        ),
      ),
    [managerList],
  );
  const managerDebut = useMemo(
    () =>
      type === "manager" ? debut ?? managerDebutList[0] : managerDebutList[0],
    [debut, managerDebutList, type],
  );
  const {
    control,
    formState: { errors },
    register,
  } = useForm<FieldTypes>({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      subject: "",
    },
    progressive: true,
    resolver: zodResolver(schema),
  });
  const toastId = useRef<Id>(null);
  const { loaded, setHeader } = useHeaderStore(
    useShallow((state) => ({
      loaded: state.loaded,
      setHeader: state.setHeader,
    })),
  );
  const { inView: inViewTalent, ref: refTalent } = useInView({
    rootMargin: "-25% 0px -25% 0px",
    triggerOnce: true,
  });
  const { inView: inViewManager, ref: refManager } = useInView({
    rootMargin: "-25% 0px -25% 0px",
    triggerOnce: true,
  });

  useEffect(() => {
    setHeader(
      <div className={`${styles.logoWrapper} pattern-cross-dots-lg`}>
        <div className={styles.inner}>
          <motion.div
            animate={{ opacity: loaded ? 1 : 0 }}
            className={styles.imageWrapper}
            initial={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.1, ease: "linear" }}
          >
            <Image
              alt="Higa Production"
              fill={true}
              loading="eager"
              quality={100}
              src="/logo.png"
            />
          </motion.div>
        </div>
      </div>,
    );
  }, [loaded, setHeader]);

  return (
    <>
      <article
        className={`${styles.article} pattern-diagonal-stripes-lg`}
        data-article="about"
        id="about"
      >
        <div className={styles.inner}>
          <motion.div
            className={styles.h2Wrapper}
            initial={{ width: 0 }}
            transition={{ duration: 0.5, ease: "circInOut" }}
            viewport={{ once: true }}
            whileInView={{ width: "100%" }}
          >
            <h2 className={`${styles.h2} ${raleway.className}`}>ABOUT</h2>
          </motion.div>
          <div className={styles.content}>
            <p>
              Higa Production（ヒガプロダクション）は、
              <br />
              Vライバー配信アプリIRIAM（イリアム）のVライバー事務所です。
            </p>
          </div>
        </div>
      </article>
      <article
        className={`${styles.article} pattern-checks-lg`}
        data-article="news"
        id="news"
      >
        <div className={styles.inner}>
          <motion.div
            className={styles.h2Wrapper}
            initial={{ width: 0 }}
            transition={{ duration: 0.5, ease: "circInOut" }}
            viewport={{ once: true }}
            whileInView={{ width: "100%" }}
          >
            <h2 className={`${styles.h2} ${raleway.className}`}>NEWS</h2>
          </motion.div>
          <div className={styles.content}>
            <ul className={styles.list}>
              {newsList.map(({ content, createdAt, id, title }) => (
                <NewsItem
                  content={content}
                  createdAt={createdAt}
                  id={id}
                  key={id}
                  title={title}
                />
              ))}
            </ul>
          </div>
        </div>
      </article>
      <article
        className={`${styles.article} pattern-zigzag-lg`}
        data-article="talent"
        id="talent"
        ref={refTalent}
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
                        type: "talent",
                      },
                      url: "/",
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
                      opacity: inViewTalent ? 1 : 0,
                      transform: `translate(${inViewTalent ? 0 : 50}%, ${
                        inViewTalent ? 0 : 50
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
                          opacity: inViewTalent ? 1 : 0,
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
                            opacity: inViewTalent ? 1 : 0,
                            transform: `translate(${inViewTalent ? 0 : 50}%, ${
                              inViewTalent ? 0 : 50
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
                          opacity: inViewTalent ? 1 : 0,
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
      <article
        className={`${styles.article} pattern-vertical-stripes-xl`}
        data-article="manager"
        id="manager"
        ref={refManager}
      >
        <div className={styles.inner}>
          <motion.div
            className={styles.h2Wrapper}
            initial={{ width: 0 }}
            transition={{ duration: 0.5, ease: "circInOut" }}
            viewport={{ once: true }}
            whileInView={{ width: "100%" }}
          >
            <h2 className={`${styles.h2} ${raleway.className}`}>MANAGER</h2>
          </motion.div>
          <div className={styles.content}>
            <ul className={styles.list}>
              {managerDebutList.map((debut) => (
                <li
                  className={`${styles.item} pattern-cross-dots-lg`}
                  key={debut}
                >
                  <Link
                    className={`${styles.link} ${jost.className} ${debut === managerDebut ? styles.active : ""}`}
                    href={`${queryString.stringifyUrl({
                      query: {
                        debut,
                        type: "manager",
                      },
                      url: "/",
                    })}#manager`}
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
                managerList.filter(
                  ({ debut }) =>
                    managerDebut === dayjs(debut).format("YYYY-MM"),
                ),
                { by: "furigana" },
              ).map(
                ({ furigana, id, imageUrl = "/no-image.png", name }, index) => (
                  <motion.li
                    animate={{
                      opacity: inViewManager ? 1 : 0,
                      transform: `translate(${inViewManager ? 0 : 50}%, ${
                        inViewManager ? 0 : 50
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
                    <Link href={`/managers/${id}#top`}>
                      <motion.div
                        animate={{
                          opacity: inViewManager ? 1 : 0,
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
                            opacity: inViewManager ? 1 : 0,
                            transform: `translate(${inViewManager ? 0 : 50}%, ${
                              inViewManager ? 0 : 50
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
                          opacity: inViewManager ? 1 : 0,
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
      <article
        className={`${styles.article} pattern-triangles-lg`}
        data-article="contact"
        id="contact"
      >
        <div className={styles.inner}>
          <motion.div
            className={styles.h2Wrapper}
            initial={{ width: 0 }}
            transition={{ duration: 0.5, ease: "circInOut" }}
            viewport={{ once: true }}
            whileInView={{ width: "100%" }}
          >
            <h2 className={`${styles.h2} ${raleway.className}`}>CONTACT</h2>
          </motion.div>
          <div className={styles.content}>
            <Form
              action="/email"
              control={control}
              onError={() => {
                if (!toastId.current) {
                  return;
                }

                toast.update(toastId.current, {
                  autoClose: 5000,
                  isLoading: false,
                  render: "送信に失敗しました",
                  type: "error",
                });
              }}
              onSubmit={() => {
                // @ts-expect-error: Ref is read-only
                toastId.current = toast("送信しています…", {
                  autoClose: false,
                  isLoading: true,
                });
              }}
              onSuccess={() => {
                if (!toastId.current) {
                  return;
                }

                toast.update(toastId.current, {
                  autoClose: 5000,
                  isLoading: false,
                  render: "メッセージを送信しました",
                  type: "success",
                });
              }}
            >
              <div className={styles.inner2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="name">
                    お名前<abbr>*</abbr>
                  </label>
                  <input
                    {...register("name")}
                    className={styles.input}
                    id="name"
                    placeholder="お名前を入力"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="name"
                    render={({ message }) => (
                      <p className={styles.error}>{message}</p>
                    )}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    メールアドレス<abbr>*</abbr>
                  </label>
                  <input
                    {...register("email")}
                    className={styles.input}
                    id="email"
                    placeholder="メールアドレスを入力"
                    type="email"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                      <p className={styles.error}>{message}</p>
                    )}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="subject">
                    件名<abbr>*</abbr>
                  </label>
                  <input
                    {...register("subject")}
                    className={styles.input}
                    id="subject"
                    placeholder="件名を入力"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="subject"
                    render={({ message }) => (
                      <p className={styles.error}>{message}</p>
                    )}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="message">
                    ご相談内容<abbr>*</abbr>
                  </label>
                  <TextareaAutosize
                    {...register("message")}
                    className={styles.textarea}
                    id="message"
                    minRows={4}
                    placeholder="ご相談内容を入力"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="message"
                    render={({ message }) => (
                      <p className={styles.error}>{message}</p>
                    )}
                  />
                </div>
              </div>
              <div className={styles.buttonWrapper}>
                <button
                  className={`${styles.button} pattern-cross-dots-lg`}
                  type="submit"
                >
                  <span>送信する</span>
                </button>
              </div>
            </Form>
          </div>
        </div>
      </article>
    </>
  );
}

type NewsItemProps = {
  content: string;
  createdAt: string;
  id: string;
  title: string;
};

function NewsItem({
  content,
  createdAt,
  id,
  title,
}: NewsItemProps): JSX.Element {
  const searchParams = useSearchParams();
  const newsId = searchParams.get("newsId");
  const isExpanded = useMemo(() => id === newsId, [id, newsId]);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getCollapseProps } = useCollapse({ isExpanded });

  return (
    <li className={styles.item}>
      <Link
        className={styles.link}
        href={
          isExpanded
            ? "/#news"
            : `${queryString.stringifyUrl({
                query: {
                  newsId: id,
                },
                url: "/",
              })}#news`
        }
      >
        <div className={styles.date}>
          {dayjs(createdAt).format("YYYY.MM.DD")}
        </div>
        <div>{title}</div>
        <Spacer grow={1} />
        {isExpanded ? (
          <IoMdArrowDropupCircle className={styles.icon} size={24} />
        ) : (
          <IoMdArrowDropdownCircle className={styles.icon} size={24} />
        )}
      </Link>
      <p {...getCollapseProps()} className={styles.text}>
        <NoSSR>{parse(content)}</NoSSR>
      </p>
    </li>
  );
}
