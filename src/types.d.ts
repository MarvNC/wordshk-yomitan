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

type DictionaryEntry =
  | false
  | {
      id: number;
      headwords: Headword[];
      tags: Tag[];
      glosses: {
        explanation: Explanation;
        examples: Example[];
      }[];
    };
