/**
 * Represents a CSV record.
 */
type CsvRecord = {
  id: string; // The unique identifier for the record.
  headword: string; // The main word or expression in the entry.
  entry: string; // The full text of the dictionary entry.
  variants: string; // The different forms or spellings of the headword.
  warning: string; // Any warnings related to the entry.
  public: string; // Whether the entry is public or not.
};

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

type Gloss = {
  explanation: LanguageData;
  examples: LanguageData[];
};

type LanguageData = {
  [key in Language]?: string[];
};

type DictionaryEntry = {
  id: number;
  headwords: Headword[];
  tags: Tag[];
  glosses: Gloss[];
};
