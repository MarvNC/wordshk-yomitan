import test from 'ava';

import { parseCantoneseReadings } from '../util/parseCantoneseReadings.js';

/**
 * @typedef {Object} TestCase
 * @property {string} text
 * @property {string} reading
 * @property {ReturnType<typeof parseCantoneseReadings>} expected
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
];

for (const { text, reading, expected } of testCases) {
  test(`parseCantoneseReadings: ${text} ${reading}`, (t) => {
    const result = parseCantoneseReadings(text, reading);
    t.deepEqual(result, expected);
  });
}
