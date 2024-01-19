import {
  Dictionary,
  DictionaryIndex,
  KanjiEntry,
  TermEntry,
} from 'yomichan-dict-builder';
import path, { parse } from 'path';

import { getCSVInfo, readCSVAsync } from './util/csvHandler.js';
import { parseCSVEntries } from './util/parseCsvEntries.js';

const dataFolder = './csvs';

(async () => {
  const { allCsv, dateString } = await getCSVInfo(dataFolder);
  const allCsvPath = path.join(dataFolder, allCsv);
  const dictionaryEntries = parseCSVEntries(allCsvPath);
})();
