/**
 * @type {Record<Language, { name: string, shortName: string, langCode: string }>}
 */
const languages = {
  yue: {
    name: '廣東話',
    shortName: '粵',
    langCode: 'yue',
  },
  eng: {
    name: '英文',
    shortName: '英',
    langCode: 'en',
  },
  zho: {
    name: '中文',
    shortName: '中',
    langCode: 'zh-Hant',
  },
  jpn: {
    name: '日文',
    shortName: '日',
    langCode: 'ja',
  },
  kor: {
    name: '韓文',
    shortName: '韓',
    langCode: 'ko',
  },
  vie: {
    name: '越南文',
    shortName: '越',
    langCode: 'vi',
  },
  lzh: {
    name: '文言文',
    shortName: '文',
    langCode: 'zh-Hant',
  },
  por: {
    name: '葡萄牙文',
    shortName: '葡',
    langCode: 'pt',
  },
  deu: {
    name: '德文',
    shortName: '德',
    langCode: 'de',
  },
  fra: {
    name: '法文',
    shortName: '法',
    langCode: 'fr',
  },
  mnc: {
    name: '滿文',
    shortName: '滿',
    langCode: 'mnc',
  },
  lat: {
    name: '拉丁文',
    shortName: '拉',
    langCode: 'la',
  },
  tib: {
    name: '藏文',
    shortName: '藏',
    langCode: 'bo',
  },
  量詞: {
    name: '量詞',
    shortName: '量詞',
    langCode: '',
  },
};

const IMAGE_FOLDER = 'images';

export { languages, IMAGE_FOLDER };
