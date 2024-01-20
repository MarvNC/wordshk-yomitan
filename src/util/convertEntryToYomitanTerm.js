import { TermEntry } from 'yomichan-dict-builder';
import { languages } from '../constants';

/**
 *
 * @param {DictionaryEntry} entry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').TermInformation[]}
 */
function convertEntryToYomitanTerm(entry) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').TermInformation[]}
   */
  const terms = [];
  // Build sc definition stuff
  return terms;
}

/**
 * Converts languageData to SC, uses languages.name if it's an explanation, shortName otherwise.
 * @param {LanguageData} languageData
 * @param {boolean} isExplanation whether the languageData is an explanation
 or an example
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
 */
function convertLanguageDataToSC(languageData, isExplanation) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const languageLiScArray = [];

  for (const language in languageData) {
    languageLiScArray.push(
      ...convertLanguageEntryToLi(
        language,
        languageData[language],
        isExplanation
      )
    );
  }

  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
   */
  const sc = {
    tag: 'ul',
    data: {
      wordshk: isExplanation ? 'explanation' : 'example',
    },
    content: languageLiScArray,
  };

  return sc;
}

/**
 * Converts a single language entry to a li item
 * @param {string} language
 * @param {string[]} languageTexts
 * @param {boolean} isExplanation
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
 */
function convertLanguageEntryToLi(language, languageTexts, isExplanation) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const languageLiScArray = [];
  const languageInfo = languages[language];
  /**
   * @type {string[]}
   */
  for (const languageText of languageTexts) {
    languageLiScArray.push({
      tag: 'li',
      lang: languageInfo.langCode,
      style: {
        listStyleType: `"(${
          isExplanation ? languageInfo.name : languageInfo.shortName
        })"`,
      },
      // TODO: use textParser function when built
      content: languageText,
      data: {
        wordshk: languageInfo.langCode,
      },
    });
  }

  return languageLiScArray;
}
