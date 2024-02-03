/**
 * Requires the jsons downloaded from https://words.hk/faiman/analysis/
 * to be in the freqjsons directory
 */
import fs from 'fs';
import path from 'path';
import { Dictionary, DictionaryIndex } from 'yomichan-dict-builder';
const freqJsonsDir = 'freqjsons';
const charCountJson = 'charcount.json';
const existingWordCountJson = 'existingwordcount.json';

(async () => {
  const freqJsons = fs.readdirSync(freqJsonsDir);
  const charCountData = JSON.parse(
    fs.readFileSync(path.join(freqJsonsDir, charCountJson)).toString()
  );
  const existingWordCountData = JSON.parse(
    fs.readFileSync(path.join(freqJsonsDir, existingWordCountJson)).toString()
  );
  console.log(`Read ${freqJsons.length} files from ${freqJsonsDir}`);
  console.log(
    `Read ${Object.keys(charCountData).length} characters from ${charCountJson}`
  );
  console.log(
    `Read ${
      Object.keys(existingWordCountData).length
    } words from ${existingWordCountJson}`
  );

  const dictionary = new Dictionary({
    fileName: 'Words.hk Frequency.zip',
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
    .setTitle(`Words.hk Frequency`)
    .setRevision(`1.0`);
  await dictionary.setIndex(dictionaryIndex.build());

  // Add characters to kanji meta
  const sortedCharCountData = Object.entries(charCountData).sort(
    ([, a], [, b]) => b - a
  );
  for (let i = 0; i < sortedCharCountData.length; i++) {
    const [char, occurrences] = sortedCharCountData[i];
    await dictionary.addKanjiMeta([
      char,
      'freq',
      {
        displayValue: `${i + 1} (${occurrences})`,
        value: i + 1,
      },
    ]);
  }

  // Add words to dictionary
  const sortedExistingWordCountData = Object.entries(
    existingWordCountData
  ).sort(([, a], [, b]) => b - a);
  for (let i = 0; i < sortedExistingWordCountData.length; i++) {
    const [word, occurrences] = sortedExistingWordCountData[i];
    await dictionary.addTermMeta([
      word,
      'freq',
      {
        displayValue: `${i + 1} (${occurrences})`,
        value: i + 1,
      },
    ]);
  }

  await dictionary.export('dist');
  console.log(`Exported dictionary to dist.`);
})();
