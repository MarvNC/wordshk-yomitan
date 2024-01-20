import {
  Dictionary,
  DictionaryIndex,
  TermEntry,
} from 'yomichan-dict-builder';
import path, { parse } from 'path';

import { getCSVInfo, readCSVAsync } from './util/csv/csvHandler.js';
import { parseCSVEntries } from './util/csv/parseCsvEntriesToJson.js';

const dataFolder = './csvs';

(async () => {
  const { allCsv, dateString } = await getCSVInfo(dataFolder);
  const allCsvPath = path.join(dataFolder, allCsv);
  const dictionaryEntries = await parseCSVEntries(allCsvPath);
})();
