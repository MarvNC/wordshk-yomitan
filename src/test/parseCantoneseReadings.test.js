import test from 'ava';

import { parseCantoneseReadings } from '../util/textHandling/parseCantoneseReadings.js';

/**
 * @typedef {Object} TestCase
 * @property {string} text
 * @property {string} reading
 * @property {TextReadingPair[]} expected
 */

/**
 * @type {TestCase[]}
 */
const testCases = [
  {
    text: '福州',
    reading: 'fuk1 zau1',
    expected: [
      { text: '福', reading: 'fuk1' },
      { text: '州', reading: 'zau1' },
    ],
  },
  {
    text: 'bu你阿麼',
    reading: 'bu4 ni5 aa3 mo1',
    expected: [
      { text: 'bu', reading: 'bu4' },
      { text: '你', reading: 'ni5' },
      { text: '阿', reading: 'aa3' },
      { text: '麼', reading: 'mo1' },
    ],
  },
  {
    text: '你get唔get到我講咩？',
    reading: 'nei5 get1 m4 get1 dou2 ngo5 gong2 me1?',
    expected: [
      { text: '你', reading: 'nei5' },
      { text: 'get', reading: 'get1' },
      { text: '唔', reading: 'm4' },
      { text: 'get', reading: 'get1' },
      { text: '到', reading: 'dou2' },
      { text: '我', reading: 'ngo5' },
      { text: '講', reading: 'gong2' },
      { text: '咩', reading: 'me1' },
      { text: '？', reading: '?' },
    ],
  },
  {
    text: '專業運動員成日斷韌帶。',
    reading: 'zyun1 jip6 wan6 dung6 jyun4 seng4 jat6 tyun5 jan6 daai2.',
    expected: [
      { text: '專', reading: 'zyun1' },
      { text: '業', reading: 'jip6' },
      { text: '運', reading: 'wan6' },
      { text: '動', reading: 'dung6' },
      { text: '員', reading: 'jyun4' },
      { text: '成', reading: 'seng4' },
      { text: '日', reading: 'jat6' },
      { text: '斷', reading: 'tyun5' },
      { text: '韌', reading: 'jan6' },
      { text: '帶', reading: 'daai2' },
      { text: '。', reading: '.' },
    ],
  },
  {
    text: '佢考咗車牌六年，終於成功嘞。',
    reading: 'keoi5 haau2 zo2 ce1 paai4 luk6 nin4 zung1 jyu1 sing4 gung1 laak3',
    expected: [
      { text: '佢', reading: 'keoi5' },
      { text: '考', reading: 'haau2' },
      { text: '咗', reading: 'zo2' },
      { text: '車', reading: 'ce1' },
      { text: '牌', reading: 'paai4' },
      { text: '六', reading: 'luk6' },
      { text: '年', reading: 'nin4' },
      { text: '，', reading: '' },
      { text: '終', reading: 'zung1' },
      { text: '於', reading: 'jyu1' },
      { text: '成', reading: 'sing4' },
      { text: '功', reading: 'gung1' },
      { text: '嘞', reading: 'laak3' },
      { text: '。', reading: '' },
    ],
  },
  {
    text: '嗰個男仔喺我手臂上搣咗一下。',
    reading: 'go2 go3 naam4 zai2 hai2 ngo5 sau2 bei3 soeng6 mit1 zo2 jat1 haa5',
    expected: [
      { text: '嗰', reading: 'go2' },
      { text: '個', reading: 'go3' },
      { text: '男', reading: 'naam4' },
      { text: '仔', reading: 'zai2' },
      { text: '喺', reading: 'hai2' },
      { text: '我', reading: 'ngo5' },
      { text: '手', reading: 'sau2' },
      { text: '臂', reading: 'bei3' },
      { text: '上', reading: 'soeng6' },
      { text: '搣', reading: 'mit1' },
      { text: '咗', reading: 'zo2' },
      { text: '一', reading: 'jat1' },
      { text: '下', reading: 'haa5' },
      { text: '。', reading: '' },
    ],
  },
  {
    text: '「乜乜M」嗰啲巴士，一定經地鐵站㗎。',
    reading:
      'mat1 mat1 em1 go2 di1 baa1 si2, jat1 ding6 ging1 dei6 tit3 zaam6 gaa3.',
    expected: [
      { text: '「', reading: '' },
      { text: '乜', reading: 'mat1' },
      { text: '乜', reading: 'mat1' },
      { text: 'M', reading: 'em1' },
      { text: '」', reading: '' },
      { text: '嗰', reading: 'go2' },
      { text: '啲', reading: 'di1' },
      { text: '巴', reading: 'baa1' },
      { text: '士', reading: 'si2' },
      { text: '，', reading: ',' },
      { text: '一', reading: 'jat1' },
      { text: '定', reading: 'ding6' },
      { text: '經', reading: 'ging1' },
      { text: '地', reading: 'dei6' },
      { text: '鐵', reading: 'tit3' },
      { text: '站', reading: 'zaam6' },
      { text: '㗎', reading: 'gaa3' },
      { text: '。', reading: '.' },
    ],
  },
];

for (const { text, reading, expected } of testCases) {
  test(`parseCantoneseReadings: ${text} ${reading}`, (t) => {
    const result = parseCantoneseReadings(text, reading);
    t.deepEqual(result, expected);
  });
}
