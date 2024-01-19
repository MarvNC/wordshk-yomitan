import test from 'ava';
import path from 'path';

import { parseCSVEntries } from '../util/parseCsvEntries.js';

const testCsvFile = 'src/test/testdata.csv';

/**
 * @type {DictionaryEntry[] | undefined}
 */
let entries;

test.before(async () => {
  entries = await parseCSVEntries(testCsvFile);
});

test('entries is defined', (t) => {
  t.not(entries, undefined);
});
