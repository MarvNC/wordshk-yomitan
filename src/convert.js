import fs from 'fs';
import {
  Dictionary,
  DictionaryIndex,
  KanjiEntry,
  TermEntry,
} from 'yomichan-dict-builder';
import path, { parse } from 'path';
import csv from 'csv-parser';

/**
 * Represents a CSV record.
 * @typedef {Object} CsvRecord
 * @property {string} id - The unique identifier for the record.
 * @property {string} headword - The main word or expression in the entry.
 * @property {string} entry - The full text of the dictionary entry.
 * @property {string} variants - The different forms or spellings of the headword.
 * @property {string} warning - Any warnings related to the entry.
 * @property {string} public - Whether the entry is public or not.
 */

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
 * @param {CsvRecord} entry
 * @returns {DictionaryEntry}
 */
function parseEntry(entry) {
  const id = parseInt(entry.id);
  if (isNaN(id)) {
    throw new Error(`Invalid id: ${entry.id}`);
  }

  const headwords = entry.headword.split(',').map((headword) => {
    const [text, reading] = headword.split(':');
    if (!text || !reading) {
      throw new Error(`Invalid headword: ${headword}`);
    }
    return {
      text,
      reading,
    };
  });

  if (entry.entry === '未有內容 NO DATA') {
    return false;
  }

  const entryLines = entry.entry.split('\n');
  const tags = parseTags(entryLines);
  const explanationsText = entryLines.join('\n');
  const explanationsTexts = explanationsText.split('\n----\n').map((text) => {
    return text.split('\n');
  });
  const glosses = [];
  for (const explanationText of explanationsTexts) {
    glosses.push(parseExplanation(explanationText));
  }

  return {
    id,
    headwords,
    tags,
    glosses,
  };
}

/**
 *
 * @param {string[]} entryLines
 */
function parseTags(entryLines) {
  if (!entryLines[0].startsWith('(pos:')) {
    throw new Error(`Entry does not start with (pos:): ${entryLines[0]}`);
  }
  // tags in format (pos:名詞)(label:書面語)
  const firstLine = entryLines.shift();
  if (!firstLine) {
    throw new Error(`Entry is empty: ${entryLines.toString()}`);
  }
  const tags = firstLine.split(')(').map((tag) => {
    tag = tag.replace(/[()]/g, '');
    const [name, value] = tag.split(':');
    return {
      name,
      value,
    };
  });
  if (tags.length === 0) {
    throw new Error(`No tags found: ${firstLine}`);
  }
  return tags;
}

/**
 *
 * @param {string[]} entryLines
 */
function parseExplanation(entryLines) {
  /**
   * @type {Explanation}
   */
  const explanation = {};

  /**
   *
   * @param {string[]} entryLines
   */
  const parseLanguages = (entryLines) => {
    const possibleLangs = [
      'yue',
      'eng',
      'zho',
      'jpn',
      'kor',
      'vie',
      'lzh',
      'por',
      'deu',
    ];
    // Consume lines as long as the line starts with a lang tag
    /**
     * @type {string[]}
     */
    const lines = [];
    while (possibleLangs.includes(entryLines[0]?.split(':')[0])) {
      const line = entryLines.shift();
      if (!line) {
        throw new Error('Expected line, got undefined');
      }
      lines.push(line);
    }
    if (lines.length === 0) {
      throw new Error(
        `Expected at least one line, got ${entryLines.join('\n')}`
      );
    }
    const yue = lines.filter((line) => line?.startsWith('yue:'));
    const eng = lines.filter((line) => line?.startsWith('eng:'));
    const zho = lines.filter((line) => line?.startsWith('zho:'));
    const jpn = lines.filter((line) => line?.startsWith('jpn:'));
    return {
      yue,
      eng,
      zho,
      jpn,
    };
  };

  const explanationElem = entryLines[0];
  if (explanationElem == '<explanation>') {
    entryLines.shift();
  }

  const { yue, eng } = parseLanguages(entryLines);
  explanation.yue = yue;
  explanation.eng = eng;

  /**
   * @type {Example[]}
   */
  const examples = [];

  while (entryLines[0] === '<eg>') {
    entryLines.shift();
    examples.push(parseLanguages(entryLines));
  }

  if (entryLines.length !== 0) {
    throw new Error(`Expected no more lines, got ${entryLines.join('\n')}`);
  }

  return { explanation, examples };
}

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
