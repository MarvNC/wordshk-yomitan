import { convertHeadwordsToSC } from './convertHeadwordsToSC.js';
import { convertGlossToLiSC } from './convertGlossToSC.js';

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
      {
        tag: 'div',
        data: {
          wordshk: 'definition',
        },
        lang: 'yue',
        content: {
          tag: 'ol',
          data: {
            wordshk: 'gloss-list',
          },
          content: entry.glosses.map(convertGlossToLiSC),
        },
      },
    ],
  };
}
