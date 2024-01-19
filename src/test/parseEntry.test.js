import test from 'ava';
import path from 'path';

import { parseCSVEntries } from '../util/parseCsvEntries.js';

const testCsvFile = 'src/test/testdata.csv';

const expectedEntries = [
  {
    id: 101613,
    headwords: [
      {
        text: '大電',
        reading: 'daai6 din6',
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '名詞',
      },
    ],
    glosses: [
      {
        explanation: {
          yue: ['D電池（量詞：粒）'],
          eng: ['D cells battery'],
        },
        egs: [],
      },
    ],
  },
  {
    id: 92456,
    headwords: [
      {
        text: '發電廠',
        reading: 'faat3 din6 cong2',
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '名詞',
      },
    ],
    glosses: [
      {
        explanation: {
          yue: ['產生#電力 嘅大型#建築物（量詞：間／座）'],
          eng: ['power plant'],
        },
        egs: [],
      },
    ],
  },
  {
    id: 82131,
    headwords: [
      {
        text: '排污',
        reading: 'paai4 wu1',
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '動詞',
      },
    ],
    glosses: [
      {
        explanation: {
          yue: ['排走#污水'],
          eng: ['to drain away sewage'],
        },
        egs: [
          {
            yue: ['排污費 (paai4 wu1)'],
            eng: ['sewerage charge'],
          },
          {
            yue: ['排污系統 (paai4 wu1 hai6 tung2)'],
            eng: ['sewage system'],
          },
          {
            yue: ['排污設施 (paai4 wu1 cit3 si1)'],
            eng: ['sewage works'],
          },
          {
            yue: ['公共排污服務 (gung1 gung6 paai4 wu1 fuk6 mou6)'],
            eng: ['public sewage services'],
          },
          {
            yue: [
              '排污設備改善計劃 (paai4 wu1 cit3 bei6 goi2 sin6 gai3 waak6)',
            ],
            eng: ['sewerage improvement programme'],
          },
          {
            yue: [
              '呢啲市區河道嘅設計以防洪及有效排污為主。 (ni1 di1 si5 keoi1 ho4 dou6 ge3 cit3 gai3 ji5 fong4 hung4 kap6 jau5 haau6 paai4 wu1 wai4 zyu2.)',
            ],
            eng: [
              'These urban channels were designed for flood prevention and effective drainage.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 72252,
    headwords: [
      {
        text: '揀選',
        reading: 'gaan2 syun2',
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '動詞',
      },
      {
        name: 'sim',
        value: '挑選',
      },
      {
        name: 'sim',
        value: '揀',
      },
      {
        name: 'sim',
        value: '選',
      },
      {
        name: 'sim',
        value: '選擇',
      },
    ],
    glosses: [
      {
        explanation: {
          yue: ['根據你嘅取向，喺兩樣嘢或以上當中，抽取一樣'],
          eng: ['to select; to choose'],
        },
        egs: [
          {
            yue: [
              '一個蠢，一個鈍，噉樣邊叫有得揀選？ (jat1 go3 ceon2, jat1 go3 deon6, gam2 joeng2 bin1 giu3 jau5 dak1 gaan2 syun2?)',
            ],
            eng: [
              'This candidate is stupid and that is dumb. How can I choose among them?',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 66987,
    headwords: [
      {
        text: '背景',
        reading: 'bui3 ging2',
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '名詞',
      },
    ],
    glosses: [
      {
        explanation: {
          yue: ['喺舞台或者現實襯托主體嘅景物、佈景、環境'],
          eng: ['background; setting'],
        },
        egs: [
          {
            yue: [
              '呢張相嘅背景係一啲椰樹。 (ni1 zoeng1 soeng2 ge3 bui3 ging2 hai6 jat1 di1 je4 syu6.)',
            ],
            eng: ['The coconut trees form a background to this picture.'],
          },
          {
            yue: [
              '段片嘅背景音樂叫咩名？ (dyun6 pin2 ge3 bui3 ging2 jam1 ngok6 giu3 me1 meng2?)',
            ],
            eng: ['What is the title of the background music in the video?'],
          },
        ],
      },
      {
        explanation: {
          yue: [
            '人嘅來歷或經歷，例如家庭、教育、工作等等，亦可以指佢哋所倚靠嘅人物或者勢力',
          ],
          eng: [
            'the "background" of a person, especially their educational background, occupation, social/family connections, etc.',
          ],
        },
        egs: [
          {
            yue: [
              '不如揾人查下佢個背景，我覺得佢好有可疑。 (bat1 jyu4 wan2 jan4 caa4 haa5 keoi5 go3 bui3 ging2, ngo5 gok3 dak1 keoi5 hou2 jau5 ho2 ji4.)',
            ],
            eng: [
              'Shall we find someone to look into his background? I think he is so suspicious.',
            ],
          },
        ],
      },
    ],
  },
];

/**
 * @type {DictionaryEntry[]}
 */
let entries;

test.before(async () => {
  entries = await parseCSVEntries(testCsvFile);
});

test('CSV successfully parsed', (t) => {
  t.not(entries, undefined);
});

for (const expectedEntry of expectedEntries) {
  const id = expectedEntry.id;
  test(`Entry ${id}`, (t) => {
    const entry = entries.find((entry) => entry.id === Number(id));
    t.deepEqual(entry, expectedEntry);
  });
}
