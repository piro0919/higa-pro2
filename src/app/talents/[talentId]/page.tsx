import TalentDetail, { TalentDetailProps } from "@/components/TalentDetail";
import client from "@/lib/client";

type PageProps = {
  params: { talentId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({
  params: { talentId },
  searchParams: { debut: selectedDebut },
}: PageProps): Promise<JSX.Element> {
  if (
    typeof selectedDebut !== "undefined" &&
    typeof selectedDebut !== "string"
  ) {
    throw new Error("selectedDebut is not undefined and string");
  }

  const { debut, images, iriamUrl, name, profile, twitterUrl } =
    await client.getListDetail({
      contentId: talentId,
      customRequestInit: {
        next: {
          // 24 時間ごと
          revalidate: 86400,
        },
      },
      endpoint: "talents",
      queries: {
        fields: [
          "debut",
          "images",
          "iriamUrl",
          "name",
          "profile",
          "twitterUrl",
        ],
      },
    });

  if (images.length === 0) {
    throw new Error("Images is not found");
  }

  const [{ url }] = images;
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
  const talents: TalentDetailProps["talents"] = talentsContents
    .filter(({ type }) => type.includes("タレント"))
    .map(({ debut, furigana, id, images, name }) => ({
      debut,
      furigana,
      id,
      imageUrl: images.at(0)?.url ?? undefined,
      name,
    }));

  return (
    <TalentDetail
      debut={debut}
      imageUrl={url}
      iriamUrl={iriamUrl}
      name={name}
      profile={profile}
      selectedDebut={selectedDebut}
      talentId={talentId}
      talents={talents}
      twitterUrl={twitterUrl}
    />
  );
}
