import { readCSVAsync } from './csvHandler.js';
import { parseEntry } from './parseEntry.js';

async function parseCSVEntries(allCsvPath) {
  const data = await readCSVAsync(allCsvPath);
  console.log(`Read ${data.length} entries from ${allCsvPath}`);
  /**
   * @type {DictionaryEntry[]}
   */
  const dictionaryEntries = [];
  for (const entry of data) {
    if (entry.entry === '未有內容 NO DATA') {
      continue;
    }
    if (
      entry.warning.includes(
        '未經覆核，可能有錯漏 UNREVIEWED ENTRY - MAY CONTAIN ERRORS OR OMISSIONS'
      )
    ) {
      continue;
    }
    try {
      const parsedEntry = parseEntry(entry);
      dictionaryEntries.push(parsedEntry);
    } catch (e) {
      console.error(`Error parsing entry ${entry.id}: ${e.message}`);
    }
  }
  return dictionaryEntries;
}

export { parseCSVEntries };
