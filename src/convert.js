import { Dictionary, DictionaryIndex } from 'yomichan-dict-builder';
import path from 'path';

import { getCSVInfo } from './util/csv/csvHandler.js';
import { parseCSVEntries } from './util/csv/parseCsvEntriesToJson.js';
import { convertEntryToYomitanTerms } from './util/yomitan/convertEntryToYomitanTerms.js';
import { findLabelValues } from './util/entryParse/parseLabels.js';
import { addYomitanTags } from './util/addYomitanTags.js';

const dataFolder = './csvs';
const exportDirectory = './dist';

(async () => {
  const { allCsv, dateString } = await getCSVInfo(dataFolder);
  const allCsvPath = path.join(dataFolder, allCsv);
  const dictionaryEntries = await parseCSVEntries(allCsvPath);
  console.log(`Found ${dictionaryEntries.length} entries.`);

  const uniqueLabels = findLabelValues(dictionaryEntries);

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
    .setRevision(`wordshk-${dateString}`);
  await dictionary.setIndex(dictionaryIndex.build());

  for (const entry of dictionaryEntries) {
    const terms = convertEntryToYomitanTerms(entry);
    for (const term of terms) {
      await dictionary.addTerm(term);
    }
  }
  console.log(`Finished adding entries to dictionary.`);

  await addYomitanTags(dictionary, uniqueLabels);

  await dictionary.export(exportDirectory);
  console.log(`Exported dictionary to ${exportDirectory}.`);
})();
