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

type LanguageArray = [
  'yue',
  'eng',
  'zho',
  'jpn',
  'kor',
  'vie',
  'lzh',
  'por',
  'deu',
  'fra',
  'mnc',
  'lat',
  'tib',
  '量詞'
];

type Language = LanguageArray[number];

type TextReadingPair = {
  text: string;
  reading: string;
};

type Tag = {
  name: string;
  value: string;
};

type Sense = {
  explanation: LanguageData;
  egs: LanguageData[];
};

type LanguageData = {
  [key in Language]?: string[];
};

type DictionaryEntry = {
  id: number;
  headwords: TextReadingPair[];
  tags: Tag[];
  senses: Sense[];
};
