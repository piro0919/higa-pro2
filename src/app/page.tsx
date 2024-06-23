import App, { AppProps } from "@/components/App";
import client from "@/lib/client";

export default async function Page(): Promise<JSX.Element> {
  const { contents: newsContents } = await client.getList({
    customRequestInit: {
      next: {
        // 24 時間ごと
        revalidate: 86400,
      },
    },
    endpoint: "news",
    queries: {
      fields: ["createdAt", "id", "title"],
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
  const { contents: talentsContents } = await client.getList({
    customRequestInit: {
      next: {
        // 24 時間ごと
        revalidate: 86400,
      },
    },
    endpoint: "talents",
    queries: {
      // fields: ["createdAt", "id", "title"],
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
    <App managerList={managerList} newsList={newsList} talents={talents} />
  );
}
