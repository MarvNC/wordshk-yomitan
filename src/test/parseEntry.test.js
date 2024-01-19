import test from 'ava';
import path from 'path';

import { parseCSVEntries } from '../util/parseCsvEntries.js';

const testCsvFile = 'src/test/testdata.csv';

/**
 * @type {DictionaryEntry[]}
 */
let entries;

const testCases = {
  101613: {
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
        examples: [],
      },
    ],
  },
};

test.before(async () => {
  entries = await parseCSVEntries(testCsvFile);
});

test('entries is defined', (t) => {
  t.not(entries, undefined);
});

for (const [id, expected] of Object.entries(testCases)) {
  test(`Entry ${id} matches expected`, (t) => {
    const entry = entries.find((entry) => entry.id === Number(id));
    t.deepEqual(entry, expected);
  });
}
