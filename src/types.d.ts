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
  [key in Language]?: string[];
};

type Example = {
  [key in Language]?: string[];
};

type Entry =
  | false
  | {
      id: number;
      headwords: Headword[];
      tags: Tag[];
      explanations: Explanation[];
      examples: Example[];
    };
