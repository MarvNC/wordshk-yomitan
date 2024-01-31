import { Dictionary, DictionaryIndex } from 'yomichan-dict-builder';
import path from 'path';
import fs from 'fs';

import { getCSVInfo } from './util/csv/csvHandler.js';
import { parseCSVEntries } from './util/csv/parseCsvEntriesToJson.js';
import { convertEntryToYomitanTerms } from './util/yomitan/convertEntryToYomitanTerms.js';
import { findLabelValues } from './util/entryParse/parseLabels.js';
import { addYomitanTags } from './util/addYomitanTags.js';
import { getAllImageURLs } from './util/entryParse/findImages.js';
import { downloadImages } from './util/imageHandler/downloadImages.js';
import { addYomitanImages } from './util/addYomitanImages.js';
import { IMAGE_FOLDER } from './constants.js';
import { compressImages } from './util/imageHandler/compressImages.js';

const dataFolder = './csvs';
const exportDirectory = './dist';
const compressedImagesFolder = './compressedImages';
const imageResizeWidth = 500;

(async () => {
  const { allCsv, dateString } = await getCSVInfo(dataFolder);
  const allCsvPath = path.join(dataFolder, allCsv);
  const dictionaryEntries = await parseCSVEntries(allCsvPath);
  console.log(`Found ${dictionaryEntries.length} entries.`);

  const uniqueLabels = findLabelValues(dictionaryEntries);

  const imageURLs = getAllImageURLs(dictionaryEntries);

  await downloadImages(imageURLs);

  const compressImagesPromise = compressImages(
    IMAGE_FOLDER,
    compressedImagesFolder,
    imageResizeWidth
  );

  const dictionary = new Dictionary({
    fileName: `Words.hk ${dateString}.zip`,
  });

  const dictionaryIndex = new DictionaryIndex()
    .setAuthor('Marv')
    .setAttribution(
      `Words.hk & contributers (https://words.hk)
    See license at https://words.hk/base/hoifong/`
    )
    .setUrl('https://github.com/MarvNC/wordshk-yomitan')
    .setDescription(
      `Converted from the free Words.hk dictionary found at https://words.hk/.
      This export contains ${dictionaryEntries.length} entries.
      Converted using https://github.com/MarvNC/yomichan-dict-builder`
    )
    .setTitle(`Words.hk 粵典 [${dateString}]`)
    .setRevision(`${getVersion()}`);
  await dictionary.setIndex(dictionaryIndex.build());

  for (const entry of dictionaryEntries) {
    const terms = convertEntryToYomitanTerms(entry);
    for (const term of terms) {
      await dictionary.addTerm(term);
    }
  }
  console.log(`Finished adding entries to dictionary.`);

  await addYomitanTags(dictionary, uniqueLabels);

  console.log(`Adding images to dictionary.`);
  await addYomitanImages(dictionary);

  await dictionary.export(exportDirectory);
  console.log(`Exported dictionary to ${exportDirectory}.`);
})();

/**
 * Get the version from the package.json file.
 * @returns {string} The version.
 */
function getVersion() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}
