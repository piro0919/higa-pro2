import App, { AppProps } from "@/components/App";
import client from "@/lib/client";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({
  searchParams: { debut, newsId, type },
}: PageProps): Promise<JSX.Element> {
  if (typeof debut !== "undefined" && typeof debut !== "string") {
    throw new Error("debut is not undefined and string");
  }

  if (typeof newsId !== "undefined" && typeof newsId !== "string") {
    throw new Error("newsId is not undefined and string");
  }

  if (typeof type !== "undefined" && typeof type !== "string") {
    throw new Error("type is not undefined and string");
  }

  const { contents: newsContents } = await client.getList({
    customRequestInit: {
      next: {
        // 24 時間ごと
        revalidate: 86400,
      },
    },
    endpoint: "news",
    queries: {
      fields: ["content", "createdAt", "id", "title"],
      limit: 3,
    },
  });
  const newsList: AppProps["newsList"] = newsContents.map(
    ({ createdAt, id, title }) => ({
      createdAt,
      id,
      title,
    }),
  );
  const newsContent: AppProps["newsContent"] = newsContents.find(
    ({ id }) => newsId === id,
  )?.content;
  const { contents: talentsContents } = await client.getList({
    customRequestInit: {
      next: {
        // 24 時間ごと
        revalidate: 86400,
      },
    },
    endpoint: "talents",
    queries: {
      fields: ["debut", "furigana", "id", "images", "name", "type"],
      limit: 100,
    },
  });
  const managerList: AppProps["managerList"] = talentsContents
    .filter(({ type }) => type.includes("マネージャー"))
    .map(({ debut, furigana, id, images, name }) => ({
      debut,
      furigana,
      id,
      imageUrl: images.at(0)?.url ?? undefined,
      name,
    }));
  const talents: AppProps["talents"] = talentsContents
    .filter(({ type }) => type.includes("タレント"))
    .map(({ debut, furigana, id, images, name }) => ({
      debut,
      furigana,
      id,
      imageUrl: images.at(0)?.url ?? undefined,
      name,
    }));

  return (
    <App
      debut={debut}
      managerList={managerList}
      newsContent={newsContent}
      newsList={newsList}
      talents={talents}
      type={type}
    />
  );
}
