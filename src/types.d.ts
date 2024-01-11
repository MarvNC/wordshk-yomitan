type Language =
  | 'yue'
  | 'eng'
  | 'zho'
  | 'jpn'
  | 'kor'
  | 'vie'
  | 'lzh'
  | 'por'
  | 'deu';

type Headword = {
  text: string;
  reading: string;
};

type Tag = {
  name: string;
  value: string;
};

type Explanation = {
  [K in Language]?: string[];
  examples: {
    [K in Language]?: string[];
  };
};

type Entry =
  | false
  | {
      id: number;
      headwords: Headword[];
      tags: Tag[];
      explanations: Explanation[];
    };
