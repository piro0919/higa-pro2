namespace MicroCMS {
  type Image = {
    height: number;
    url: string;
    width: number;
  };

  type News = {
    content: string;
    title: string;
  };

  type Talents = {
    debut: string;
    furigana: string;
    images: Image[];
    iriamUrl: string;
    name: string;
    profile: string;
    rank?: number;
    type: string;
    twitterUrl: string;
  };

  type Endpoints = {
    list: {
      news: News;
      talents: Talents;
    };
    object: {
      news: News;
      talents: Talents;
    };
  };
}
