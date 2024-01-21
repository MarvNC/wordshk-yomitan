import test from 'ava';

import { parseCantoneseReadings } from '../util/textHandling/parseCantoneseReadings.js';

/**
 * @typedef {Object} TestCase
 * @property {string} text
 * @property {string} reading
 * @property {TextReadingPair[]} [expected]
 * @property {boolean} [shouldThrow]
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
  {
    text: '𨂾過條溪',
    reading: 'laam3 gwo3 tiu4 kai1',
    expected: [
      { text: '𨂾', reading: 'laam3' },
      { text: '過', reading: 'gwo3' },
      { text: '條', reading: 'tiu4' },
      { text: '溪', reading: 'kai1' },
    ],
  },
  {
    text: '呢個商場係好多居民返屋企嘅必經之路，有好有唔好囉。',
    reading:
      'nei1 go3 soeng1 coeng4 hai6 hou2 do1 geoi1 man4 faan1 uk1 kei2 ge3 bit1ging1 zi1 lou6, jau5 hou2 jau5 m4 hou2 lo1.',
    expected: [
      { text: '呢', reading: 'nei1' },
      { text: '個', reading: 'go3' },
      { text: '商', reading: 'soeng1' },
      { text: '場', reading: 'coeng4' },
      { text: '係', reading: 'hai6' },
      { text: '好', reading: 'hou2' },
      { text: '多', reading: 'do1' },
      { text: '居', reading: 'geoi1' },
      { text: '民', reading: 'man4' },
      { text: '返', reading: 'faan1' },
      { text: '屋', reading: 'uk1' },
      { text: '企', reading: 'kei2' },
      { text: '嘅', reading: 'ge3' },
      { text: '必', reading: 'bit1' },
      { text: '經', reading: 'ging1' },
      { text: '之', reading: 'zi1' },
      { text: '路', reading: 'lou6' },
      { text: '，', reading: ',' },
      { text: '有', reading: 'jau5' },
      { text: '好', reading: 'hou2' },
      { text: '有', reading: 'jau5' },
      { text: '唔', reading: 'm4' },
      { text: '好', reading: 'hou2' },
      { text: '囉', reading: 'lo1' },
      { text: '。', reading: '.' },
    ],
  },
  {
    text: '今晚演出嘅粵劇劇目係《白兔會》。',
    reading:
      'gam1 maan5 jin2 ceot1 ge3 jyut6 kek6 kek6 muk6 hai6 baak6 tou3 wui6.',
    expected: [
      { text: '今', reading: 'gam1' },
      { text: '晚', reading: 'maan5' },
      { text: '演', reading: 'jin2' },
      { text: '出', reading: 'ceot1' },
      { text: '嘅', reading: 'ge3' },
      { text: '粵', reading: 'jyut6' },
      { text: '劇', reading: 'kek6' },
      { text: '劇', reading: 'kek6' },
      { text: '目', reading: 'muk6' },
      { text: '係', reading: 'hai6' },
      { text: '《', reading: '' },
      { text: '白', reading: 'baak6' },
      { text: '兔', reading: 'tou3' },
      { text: '會', reading: 'wui6' },
      { text: '》', reading: '.' },
      { text: '。', reading: '' },
    ],
  },
  {
    text: 'Panda好pandai踢呢',
    reading: 'pan3 daa1 hou2 baan3 naai1 tek3 le3',
    shouldThrow: true,
  },
];

for (const { text, reading, expected, shouldThrow } of testCases) {
  test(`${
    shouldThrow ? ' (should throw)' : ''
  }parseCantoneseReadings: ${text} ${reading}`, (t) => {
    if (shouldThrow) {
      t.throws(() => parseCantoneseReadings(text, reading));
      return;
    } else {
      const result = parseCantoneseReadings(text, reading);
      t.deepEqual(result, expected);
    }
  });
}
