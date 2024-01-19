import fs from 'fs';
import {
  Dictionary,
  DictionaryIndex,
  KanjiEntry,
  TermEntry,
} from 'yomichan-dict-builder';
import path, { parse } from 'path';
import csv from 'csv-parser';

import { parseEntry } from './parseEntry.js';

const dataFolder = './csvs';

const csvHeaders = ['id', 'headword', 'entry', 'variants', 'warning', 'public'];

(async () => {
  const { allCsv, dateString } = await getCSVInfo();
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

/**
 *
 * @param {string} allCsvPath
 * @returns {Promise<CsvRecord[]>}
 */
async function readCSVAsync(allCsvPath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(allCsvPath)
      .pipe(
        csv({
          headers: csvHeaders,
          strict: true,
          skipLines: 2,
          quote: '"',
        })
      )
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function getCSVInfo() {
  // Get contents of data folder
  const files = await fs.promises.readdir(dataFolder);
  // Filter out non-csv files
  const csvFiles = files.filter((file) => file.endsWith('.csv'));
  const allCsv = files.find((file) => file.startsWith('all-'));
  if (!allCsv) {
    throw new Error('No all- file found');
  }

  const dateEpoch = allCsv.split('-')[1].split('.')[0];
  const date = new Date(Number(dateEpoch) * 1000);
  const dateString = date.toISOString().split('T')[0];
  console.log(`Date of data: ${dateString}`);

  return {
    allCsv,
    dateString,
  };
}
