import { TermEntry } from 'yomichan-dict-builder';
import { languages } from '../../constants';

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
  return terms;
}

/**
 * Converts headword(s) to structured content.
 * @param {Headword[]} headwords
 */
function convertHeadwordsToSC(headwords) {
  const headwordsSCList = headwords.map(headwordToSC);
  const separator = '・';
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const headwordsSCListWithSeparator = [];
  for (let i = 0; i < headwordsSCList.length; i++) {
    headwordsSCListWithSeparator.push(headwordsSCList[i]);
    if (i !== headwordsSCList.length - 1) {
      headwordsSCListWithSeparator.push(separator);
    }
  }
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
   */
  const sc = {
    tag: 'div',
    data: {
      wordshk: 'headword',
    },
    lang: 'yue',
    content: ['【', ...headwordsSCListWithSeparator, '】'],
  };
  return sc;
}

/**
 * Converts a headword to structured content.
 * @param {Headword} headword
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
 */
function headwordToSC(headword) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
   */
  const sc = {
    tag: 'span',
    content: headword.text,
  };
  // TODO: use parser function when built to add ruby text
  return sc;
}

/**
 * Converts a gloss to structured content.
 * @param {Gloss} gloss
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
 */
function convertGlossToSC(gloss) {
  // TODO
  return '';
}

/**
 * Converts one single languageData to structured content representing a definition/example/sentence.
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
