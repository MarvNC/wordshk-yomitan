import { convertHeadwordsToSC } from './convertHeadwordsToSC.js';
import { convertGlossToSC } from './convertGlossToSC.js';

/**
 * Converts a dictionary entry to a detailed definition.
 * @param {DictionaryEntry} entry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').DetailedDefinition}
 */
function convertEntryToDetailedDefinition(entry) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').DetailedDefinition}
   */
  const detailedDefinition = {
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
        content: entry.glosses.map((gloss) => {
          return convertGlossToSC(gloss);
        }),
      },
    ],
  };
  return detailedDefinition;
}
