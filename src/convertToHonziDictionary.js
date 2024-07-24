import fs from 'fs/promises';
import { Dictionary, DictionaryIndex, KanjiEntry } from 'yomichan-dict-builder';
import { getVersion } from './util/getVersion.js';
import { dataFolder, exportDirectory, HONZI_INDEX_FILE } from './constants.js';
import { readAndParseCSVs } from './util/readAndParseCSVs.js';
import { isSingleCJKHanzi } from 'is-cjk-hanzi';

(async () => {
  const tagName = process.argv[2] ?? 'latest';

  const { dictionaryEntries, dateString } = await readAndParseCSVs(dataFolder);

  /** @type {`${string}.zip`} */
  const honziDictionaryFilename = `Words.hk.Honzi.${dateString}.zip`;
  const dictionary = new Dictionary({
    fileName: honziDictionaryFilename,
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
      Converted using https://github.com/MarvNC/yomichan-dict-builder`
    )
    .setTitle(`Words.hk 粵典 漢字 [${dateString}]`)
    .setRevision(dateString)
    .setIsUpdatable(true)
    .setIndexUrl(
      `https://github.com/MarvNC/wordshk-yomitan/releases/latest/download${HONZI_INDEX_FILE}`
    )
    .setDownloadUrl(
      `https://github.com/MarvNC/wordshk-yomitan/releases/${tagName}/download/${honziDictionaryFilename}`
    );
  await dictionary.setIndex(dictionaryIndex.build());

  // save index file to exportDirectory
  await dictionaryIndex.export(exportDirectory, HONZI_INDEX_FILE);

  for (const entry of dictionaryEntries) {
    addHonziEntry(dictionary, entry);
  }
  console.log(`Finished adding entries to dictionary.`);

  const stats = await dictionary.export(exportDirectory);
  console.log(`Exported honzi dictionary to ${exportDirectory}.`);
  console.log(`Added ${stats.kanjiCount} honzi entries.`);
})();

/**
 *
 * @param {Dictionary} dictionary
 * @param {DictionaryEntry} entry
 */
function addHonziEntry(dictionary, entry) {
  for (const headword of entry.headwords) {
    if (!isSingleCJKHanzi(headword.text)) {
      continue;
    }
    const kanjiEntry = new KanjiEntry(headword.text).setKunyomi(
      headword.readings.join(' ')
    );
    for (const sense of entry.senses) {
      for (const explanationText of Object.values(sense.explanation)) {
        kanjiEntry.addMeanings(explanationText);
      }
    }
    dictionary.addKanji(kanjiEntry.build());
  }
}
