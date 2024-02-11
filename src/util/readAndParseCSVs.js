import path from 'path';
import { getCSVInfo } from './csv/csvHandler.js';
import { parseCSVEntries } from './csv/parseCsvEntriesToJson.js';

/**
 * @param {string} dataFolder
 */
export async function readAndParseCSVs(dataFolder) {
  const { allCsv, dateString } = await getCSVInfo(dataFolder);
  const dictionaryEntries = await parseCSVEntries(
    path.join(dataFolder, allCsv)
  );
  console.log(`Found ${dictionaryEntries.length} entries.`);

  return { dictionaryEntries, dateString };
}
