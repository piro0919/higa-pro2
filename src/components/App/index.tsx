"use client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Jost, Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Form, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import sortArray from "sort-array";
import { z } from "zod";
import styles from "./style.module.scss";

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
  managerList: Manager[];
  newsList: News[];
  talents: Talent[];
};

export default function App({
  managerList,
  newsList,
  talents,
}: AppProps): JSX.Element {
  const talentDebutList = useMemo(
    () =>
      Array.from(
        new Set(
          sortArray(talents, { by: "debut", order: "asc" }).map(({ debut }) =>
            dayjs(debut).format("YYYY.MM"),
          ),
        ),
      ),
    [talents],
  );
  const talentDebut = useMemo(() => talentDebutList[0], [talentDebutList]);
  const managerDebutList = useMemo(
    () =>
      Array.from(
        new Set(
          sortArray(managerList, { by: "debut", order: "asc" }).map(
            ({ debut }) => dayjs(debut).format("YYYY.MM"),
          ),
        ),
      ),
    [managerList],
  );
  const managerDebut = useMemo(() => managerDebutList[0], [managerDebutList]);
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

  return (
    <>
      <article
        className={`${styles.article} pattern-diagonal-stripes-lg`}
        data-article="about"
        id="about"
      >
        <div className={styles.inner}>
          <h2 className={`${styles.h2} ${raleway.className}`}>ABOUT</h2>
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
          <h2 className={`${styles.h2} ${raleway.className}`}>NEWS</h2>
          <div className={styles.content}>
            <ul className={styles.list}>
              {newsList.map(({ createdAt, id, title }) => (
                <li className={styles.item} key={id}>
                  <div>{dayjs(createdAt).format("YYYY.MM.DD")}</div>
                  <div>{title}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
      <article
        className={`${styles.article} pattern-zigzag-lg`}
        data-article="talent"
        id="talent"
      >
        <div className={styles.inner}>
          <h2 className={`${styles.h2} ${raleway.className}`}>TALENT</h2>
          <div className={styles.content}>
            <ul className={styles.list}>
              {talentDebutList.map((debut) => (
                <li
                  className={`${styles.item} pattern-cross-dots-lg`}
                  key={debut}
                >
                  <Link className={`${styles.link} ${jost.className}`} href="/">
                    {debut}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={styles.list2}>
              {talents
                .filter(
                  ({ debut }) => talentDebut === dayjs(debut).format("YYYY.MM"),
                )
                .map(({ furigana, id, imageUrl = "/no-image.png", name }) => (
                  <li className={`${styles.item2} pattern-grid-md`} key={id}>
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
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </article>
      <article
        className={`${styles.article} pattern-vertical-stripes-xl`}
        data-article="manager"
        id="manager"
      >
        <div className={styles.inner}>
          <h2 className={`${styles.h2} ${raleway.className}`}>MANAGER</h2>
          <div className={styles.content}>
            <ul className={styles.list}>
              {managerDebutList.map((debut) => (
                <li
                  className={`${styles.item} pattern-cross-dots-lg`}
                  key={debut}
                >
                  <Link className={`${styles.link} ${jost.className}`} href="/">
                    {debut}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={styles.list2}>
              {managerList
                .filter(
                  ({ debut }) =>
                    managerDebut === dayjs(debut).format("YYYY.MM"),
                )
                .map(({ furigana, id, imageUrl = "/no-image.png", name }) => (
                  <li className={`${styles.item2} pattern-grid-md`} key={id}>
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
                  </li>
                ))}
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
          <h2 className={`${styles.h2} ${raleway.className}`}>CONTACT</h2>
          <div className={styles.content}>
            <Form
              action="/api"
              control={control}
              onError={() => {}}
              onSubmit={() => {}}
              onSuccess={() => {}}
            >
              <div className={styles.inner}>
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
