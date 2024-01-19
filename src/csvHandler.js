import fs from 'fs';
import csv from 'csv-parser';
const csvHeaders = ['id', 'headword', 'entry', 'variants', 'warning', 'public'];

/**
 * Reads the all- file and returns the parsed entries
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

/**
 * Reads the contents of the data folder and returns the name of the all- file and the date of the data
 * @param {string} dataFolder
 */
async function getCSVInfo(dataFolder) {
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

export { readCSVAsync, getCSVInfo };
