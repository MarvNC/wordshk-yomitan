import fs from 'fs/promises';
import { Dictionary, DictionaryIndex } from 'yomichan-dict-builder';

import { convertEntryToYomitanTerms } from './util/yomitan/convertEntryToYomitanTerms.js';
import { findLabelValues } from './util/entryParse/parseLabels.js';
import { addYomitanTags } from './util/addYomitanTags.js';
import { getAllImageURLs } from './util/entryParse/findImages.js';
import { downloadImages } from './util/imageHandler/downloadImages.js';
import { addYomitanImages } from './util/addYomitanImages.js';
import {
  IMAGE_FOLDER,
  COMPRESSED_IMAGES_FOLDER,
  IMAGE_RESIZE_WIDTH,
  TERM_INDEX_FILE,
} from './constants.js';
import { compressImages } from './util/imageHandler/compressImages.js';
import { dataFolder, exportDirectory } from './constants.js';
import { getVersion } from './util/getVersion.js';
import { readAndParseCSVs } from './util/readAndParseCSVs.js';

(async () => {
  const tagName = process.argv[2] ?? 'latest';

  const { dictionaryEntries, dateString } = await readAndParseCSVs(dataFolder);

  const uniqueLabels = findLabelValues(dictionaryEntries);

  const imageURLs = getAllImageURLs(dictionaryEntries);

  await downloadImages(imageURLs);

  const compressImagesPromise = compressImages(
    IMAGE_FOLDER,
    COMPRESSED_IMAGES_FOLDER,
    IMAGE_RESIZE_WIDTH
  );

  /** @type {`${string}.zip`} */
  const termDictionaryFileName = `Words.hk.${dateString}.zip`;
  const dictionary = new Dictionary({
    fileName: termDictionaryFileName,
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
    .setRevision(dateString)
    .setIsUpdatable(true)
    .setIndexUrl(
      `https://github.com/MarvNC/wordshk-yomitan/releases/download/latest/${TERM_INDEX_FILE}`
    )
    .setDownloadUrl(
      `https://github.com/MarvNC/wordshk-yomitan/releases/download/${tagName}/${termDictionaryFileName}`
    );
  await dictionary.setIndex(dictionaryIndex.build());

  // save index file to exportDirectory
  await dictionaryIndex.export(exportDirectory, TERM_INDEX_FILE);

  for (const entry of dictionaryEntries) {
    const terms = convertEntryToYomitanTerms(entry);
    for (const term of terms) {
      await dictionary.addTerm(term);
    }
  }
  console.log(`Finished adding entries to dictionary.`);

  await addYomitanTags(dictionary, uniqueLabels);

  console.log(`Adding images to dictionary.`);
  // Wait for images to be compressed before adding
  await compressImagesPromise;
  await addYomitanImages(dictionary, COMPRESSED_IMAGES_FOLDER);

  await dictionary.export(exportDirectory);
  console.log(`Exported dictionary to ${exportDirectory}.`);
})();
