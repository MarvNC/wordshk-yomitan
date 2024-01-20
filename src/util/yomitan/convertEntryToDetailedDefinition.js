import { convertHeadwordsToSC } from './convertHeadwordsToSC.js';
import { convertSenseToLiSC } from './convertSenseToSC.js';
import { createEntryAttribution } from './createEntryAttrubution.js';

/**
 * Converts a dictionary entry to a detailed definition.
 * @param {DictionaryEntry} entry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').DetailedDefinition}
 */
function convertEntryToDetailedDefinition(entry) {
  return {
    type: 'structured-content',
    content: [
      // Headword
      convertHeadwordsToSC(entry.headwords),
      // Senses with explanation/examples
      {
        tag: 'div',
        data: {
          wordshk: 'definition',
        },
        lang: 'yue',
        content: {
          tag: 'ol',
          data: {
            wordshk: 'sense-list',
          },
          content: entry.senses.map(convertSenseToLiSC),
        },
      },
      // Attribution
      createEntryAttribution(entry),
    ],
  };
}

export { convertEntryToDetailedDefinition };
