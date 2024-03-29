import test from 'ava';
import path from 'path';

import { parseCSVEntries } from '../util/csv/parseCsvEntriesToJson.js';

const testCsvFile = 'src/test/testdata.csv';

const expectedEntries = [
  {
    id: 101613,
    headwords: [
      {
        text: '大電',
        readings: ['daai6 din6'],
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '名詞',
      },
    ],
    senses: [
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
        readings: ['faat3 din6 cong2'],
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '名詞',
      },
    ],
    senses: [
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
        readings: ['paai4 wu1'],
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '動詞',
      },
    ],
    senses: [
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
        readings: ['gaan2 syun2'],
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
    senses: [
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
        readings: ['bui3 ging2'],
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '名詞',
      },
    ],
    senses: [
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
  {
    id: 90185,
    headwords: [
      {
        text: '天干地支',
        readings: ['tin1 gon1 dei6 zi1'],
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '名詞',
      },
      {
        name: 'sim',
        value: '干支',
      },
    ],
    senses: [
      {
        explanation: {
          yue: [
            '「#天干」同「#地支」嘅合稱。十天干分別係「#甲#乙#丙#丁#戊#己#庚#辛#壬#癸」。 十二地支係：「#子#丑#寅#卯#辰#巳#午#未#申#酉#戌#亥」。 天干同地支組合就成為以「#甲子」為首嘅六十干支循環。\n\n干支循環通常用嚟計年份。天干亦可以獨立用嚟順序將物件命名，第一個叫「甲」、第二個叫「乙」，如此類推。用法類似西方嘅「A, B, C」 或 「α, β, γ」。中國傳統紀時間嘅方法係將一日分成十二個時辰，每一個時辰由一個地支表示，「子時」係半夜 (11pm 至 1am)，如此類推。',
          ],
          eng: [
            'Literally "Heavenly Stems and Earthly Branches". It is a traditional Chinese system of counting. Heavenly Stems and Earthly Branches are collectively known as "Stem-Branch".\n\nThe 10 Heavenly Stems are 甲(gaap3) 乙(jyut6) 丙(bing2) 丁(ding1) 戊(mou6) 己(gei2) 庚(gang1) 辛(san1) 壬(jam4) 癸(gwai3).\n\nThe 12 Earthly Branches are 子(zi2) 丑(cau2) 寅(jan4) 卯(maau5) 辰(san4) 巳(zi6) 午(ng5) 未(mei6) 申(san1) 酉(jau5) 戌(seot1) 亥(hoi6). Each Heavenly Stem is paired with an Earthly Branch to form the "stem-branch" sexagenary (i.e. 60 element) cycle that starts with 甲子 (gaap3 zi2)\n\nThe sexagenary cycle is often used for counting years in the Chinese calendar. Heavenly Stems are also used independently to name things in a particular order -- the first is labeled "gaap3", the second "jyut6", the third "bing2", and so on. It is similar to how "A, B, C" and "α, β, γ" are used in western cultures. Earthly Branches are also traditionally used to denote time. One day is divided into twelve slots called Chinese-hours (#時辰), starting from 子時 (zi2 si4), which is 11pm to 1am.',
          ],
        },
        egs: [
          {
            yue: ['乙等 / 乙級 (jyut6 dang2 / jyut6 kap1)'],
            eng: ['B grade'],
          },
          {
            yue: ['甲級戰犯 (gaap3 kap1 zin3 faan2)'],
            eng: ['Class A war criminal'],
          },
          {
            yue: ['戊戌變法 (mou6 seot1 bin3 faat3)'],
            eng: [
              "The Hundred Days' Reform of the Qing Dynasty (it is called 戊戌變法 because it occurred in the 戊戌 year)",
            ],
          },
          {
            yue: ['辛亥革命 (san1 hoi6 gaap3 ming6)'],
            eng: ['The Xinhai Revolution (Pinyin romanization)'],
          },
          {
            yue: ['子時 (zi2 si4)'],
            eng: ['midnight'],
          },
          {
            yue: ['午時 (ng5 si4)'],
            eng: ['noon'],
          },
        ],
      },
    ],
  },
  {
    id: 97033,
    headwords: [
      {
        text: '着',
        readings: ['zoek6'],
      },
      {
        text: '著',
        readings: ['zoek6'],
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '詞綴',
      },
      {
        name: 'label',
        value: '書面語',
      },
    ],
    senses: [
      {
        explanation: {
          yue: ['表示動作、狀態進行緊、持續緊，類似「#住」、「#下」'],
          eng: [
            "to express that an action is in process and a state is prolonged; similar to '#住' zyu6 or '#下' haa5",
          ],
        },
        egs: [
          {
            zho: ['痛並快樂着 (tung3 bing6 faai3 lok6 zoek6)'],
            yue: ['痛住開心 (tung3 zyu6 hoi1 sam1)'],
            eng: ['feeling painful and happy'],
          },
          {
            zho: [
              '走着走着就到了課室。 (zau2 zoek6 zau2 zoek6 zau6 dou3 liu5 fo3 sat1.)',
            ],
            yue: [
              '行下行下就到咗班房。 (haang4 haa5 haang4 haa5 zau6 dou3 zo2 baan1 fong2.)',
            ],
            eng: ['Walking, (we) have arrived at the classroom.'],
          },
          {
            zho: ['他們正説着話呢。 (taa1 mun4 zing3 syut3 zoek6 waa6 ne1.)'],
            yue: ['佢哋講緊嘢啊。 (keoi5 dei6 gong2 gan2 je5 aa3.)'],
            eng: ['They are talking.'],
          },
          {
            zho: ['等着瞧。 (dang2 zoek6 ciu4.)'],
            yue: ['睇下點。 (tai2 haa5 dim2.)'],
            eng: ["(Let's) wait and see."],
          },
        ],
      },
      {
        explanation: {
          yue: ['動詞後綴，表示動作達到目的、有結果；類似「#到」（dou2）'],
          eng: [
            'verbal suffix to mean that the aim of an action has been achieved or its result has come out; similar to #到 dou2',
          ],
        },
        egs: [
          {
            zho: ['你的錶我沒見着。 (nei5 dik1 biu1 ngo5 mut6 gin3 zoek6.)'],
            yue: ['你隻錶我見唔到。 (nei5 zek3 biu1 ngo5 gin3 m4 dou2.)'],
            eng: ['I have not found your watch.'],
          },
        ],
      },
      {
        explanation: {
          yue: ['喺句尾出現，表示祈使'],
          eng: ['used at the end of a sentence to form an imperative'],
        },
        egs: [
          {
            zho: ['聽着。 (ting3 zoek6.)'],
            yue: ['聽住。 (teng1 zyu6.)'],
            eng: ['Listen.'],
          },
          {
            zho: [
              '你可好生給我應付着。 (nei5 ho2 hou2 sang1 kap1 ngo5 jing3 fu6 zoek6.)',
            ],
            yue: [
              '你好好哋同我應付下。 (nei5 hou2 hou2 dei2 tung4 ngo5 jing3 fu6 haa5.)',
              '你小心啲同我應付下。 (nei5 siu2 sam1 di1 tung4 ngo5 jing3 fu6 haa5.)',
            ],
            eng: ['Handle this well (for me).'],
          },
        ],
      },
    ],
  },
  {
    id: 93305,
    headwords: [
      {
        text: '揸正嚟做',
        readings: ['zaa1 zeng3 lai4 zou6', 'zaa1 zeng3 lei4 zou6'],
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '動詞',
      },
      {
        name: 'sim',
        value: '揸正',
      },
    ],
    senses: [
      {
        explanation: {
          yue: ['嚴格依照規矩，不留餘地，冇人情講'],
          eng: [
            'to follow the rules strictly; to "go by the book"; to leave no room for discretion',
          ],
        },
        egs: [
          {
            yue: [
              '唔好怪我揸正嚟做。 (m4 hou2 gwaai3 ngo5 zaa1 zeng3 lei4 zou6.)',
            ],
            eng: ["Don't blame me for following the rules too strictly."],
          },
        ],
      },
    ],
  },
  {
    id: 96792,
    headwords: [
      {
        text: '牛河博士',
        readings: ['ngau4 ho2 bok3 si6'],
      },
    ],
    tags: [
      {
        name: 'pos',
        value: '名詞',
      },
      {
        name: 'label',
        value: '專名',
      },
      {
        name: 'label',
        value: '潮語',
      },
      {
        name: 'ref',
        value: 'https://evchk.fandom.com/zh/wiki/曹宏威',
      },
    ],
    senses: [
      {
        explanation: {
          yue: [
            '香港#學者 曹宏威喺#網民 之間嘅叫法，佢因為#乾炒牛河 而一舉成名',
          ],
          eng: ['Wung-wai Tso, literally "Doctor Beef Chow-fun"'],
        },
        egs: [],
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
