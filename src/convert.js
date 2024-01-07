import fs from 'fs';
import {
  Dictionary,
  DictionaryIndex,
  KanjiEntry,
  TermEntry,
} from 'yomichan-dict-builder';
import path from 'path';
import csv from 'csv-parser';

const dataFolder = './csvs';

(async () => {
  const { allCsv, wordposCsv, dateString } = await getCSVInfo();
})();

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

  const wordposCsv = files.find((file) => file.startsWith('wordpos-'));
  if (!wordposCsv) {
    throw new Error('No wordpos- file found');
  }

  return {
    allCsv,
    wordposCsv,
    dateString,
  };
}
