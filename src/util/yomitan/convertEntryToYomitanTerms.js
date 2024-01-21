import { TermEntry } from 'yomichan-dict-builder';
import { convertEntryToDetailedDefinition } from './convertEntryToDetailedDefinition.js';

/**
 *
 * @param {DictionaryEntry} entry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').TermInformation[]}
 */
function convertEntryToYomitanTerms(entry) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').TermInformation[]}
   */
  const yomitanTerms = [];

  const detailedDefinition = convertEntryToDetailedDefinition(entry);
  for (const headword of entry.headwords) {
    for (const reading of headword.readings) {
      const termEntry = new TermEntry(headword.text)
        .setReading(reading)
        .addDetailedDefinition(detailedDefinition);
      yomitanTerms.push(termEntry.build());
    }
  }

  return yomitanTerms;
}

export { convertEntryToYomitanTerms };