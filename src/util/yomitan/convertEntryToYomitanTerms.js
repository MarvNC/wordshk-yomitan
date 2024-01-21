import { TermEntry } from 'yomichan-dict-builder';
import { convertEntryToDetailedDefinition } from './convertEntryToDetailedDefinition.js';

/**
 *
 * @param {DictionaryEntry} dictionaryEntry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').TermInformation[]}
 */
function convertEntryToYomitanTerms(dictionaryEntry) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').TermInformation[]}
   */
  const yomitanTerms = [];

  const detailedDefinition = convertEntryToDetailedDefinition(dictionaryEntry);
  for (const headword of dictionaryEntry.headwords) {
    for (const reading of headword.readings) {
      const yomitanTermEntry = new TermEntry(headword.text)
        .setReading(reading)
        .addDetailedDefinition(detailedDefinition);
      addTagsToTermEntry(dictionaryEntry, yomitanTermEntry);
      yomitanTerms.push(yomitanTermEntry.build());
    }
  }

  return yomitanTerms;
}

/**
 * @param {DictionaryEntry} dictionaryEntry
 * @param {TermEntry} termEntry
 */
function addTagsToTermEntry(dictionaryEntry, termEntry) {
  const termTags = [];
  const entryTags = [];
  for (const tag of dictionaryEntry.tags) {
    if (tag.name === 'pos') {
      entryTags.push(tag.value);
    } else if (tag.name === 'label') {
      termTags.push(tag.value);
    }
  }
  termEntry.setTermTags(termTags.join(' '));
  termEntry.setDefinitionTags(entryTags.join(' '));
}

export { convertEntryToYomitanTerms };
