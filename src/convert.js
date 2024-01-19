import {
  Dictionary,
  DictionaryIndex,
  KanjiEntry,
  TermEntry,
} from 'yomichan-dict-builder';
import path, { parse } from 'path';

import { getCSVInfo, readCSVAsync } from './util/csvHandler.js';
import { parseEntry } from './util/parseEntry.js';

const dataFolder = './csvs';

(async () => {
  const { allCsv, dateString } = await getCSVInfo(dataFolder);
  const allCsvPath = path.join(dataFolder, allCsv);
  const data = await readCSVAsync(allCsvPath);
  console.log(`Read ${data.length} entries from ${allCsvPath}`);
  for (const entry of data) {
    try {
      const parsedEntry = parseEntry(entry);
      if (!parsedEntry) {
        continue;
      }
    } catch (e) {
      if (entry.public !== '未公開') {
        console.error(`Error parsing entry ${entry.id}: ${e.message}`);
      }
    }
  }
})();
