import { readCSVAsync } from './csvHandler.js';
import { parseEntry } from './parseEntry.js';

async function parseCSVEntries(allCsvPath) {
  const data = await readCSVAsync(allCsvPath);
  console.log(`Read ${data.length} entries from ${allCsvPath}`);
  /**
   * @type {DictionaryEntry[]}
   */
  const dictionaryEntries = [];
  let unpublishedCount = 0;
  let noDataCount = 0;
  let unreviewedCount = 0;
  for (const entry of data) {
    if (entry.entry === '未有內容 NO DATA') {
      noDataCount++;
      continue;
    }
    if (
      entry.warning.includes(
        '未經覆核，可能有錯漏 UNREVIEWED ENTRY - MAY CONTAIN ERRORS OR OMISSIONS'
      )
    ) {
      unreviewedCount++;
    }
    if (entry.public !== '已公開') {
      unpublishedCount++;
    }
    try {
      const parsedEntry = parseEntry(entry);
      dictionaryEntries.push(parsedEntry);
    } catch (error) {
      console.log(`Error parsing entry ${entry.id}: ${error.message}`);
    }
  }
  console.log(`Parsed ${dictionaryEntries.length} entries`);
  console.log(`Skipped ${noDataCount} no data entries`);
  return dictionaryEntries;
}

export { parseCSVEntries };
