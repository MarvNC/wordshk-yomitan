import { languages } from '../../constants.js';
import { isStringSentence } from '../textHandling/textUtils.js';
import { convertTextToSC } from './parseTextToSC.js';

const examplePhraseText = '配詞 / 用法';
const exampleSentenceText = '例句';
const examplePhraseEmoji = '💬';
const exampleSentenceEmoji = '📝';

/**
 * Converts a sense to structured content as a li.
 * @param {Sense} sense
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
 */
function convertSenseToLiSC(sense) {
  /**
   * @type {LanguageData[]}
   */
  const phrases = [];
  /**
   * @type {LanguageData[]}
   */
  const sentences = [];
  for (const eg of sense.egs) {
    // Check if any of the language datas are a sentence
    const isEgSentence = Object.values(eg).some((languageData) => {
      return languageData.some((languageText) => {
        return isStringSentence(languageText);
      });
    });
    if (isEgSentence) {
      sentences.push(eg);
    } else {
      phrases.push(eg);
    }
  }

  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const exampleNodes = [];
  if (phrases.length > 0) {
    exampleNodes.push(
      convertExampleToSC(
        phrases,
        'phrase',
        examplePhraseText,
        examplePhraseEmoji
      )
    );
  }
  if (sentences.length > 0) {
    exampleNodes.push(
      convertExampleToSC(
        sentences,
        'sentence',
        exampleSentenceText,
        exampleSentenceEmoji
      )
    );
  }

  return {
    tag: 'li',
    data: {
      wordshk: 'sense',
    },
    content: [
      {
        tag: 'div',
        data: {
          wordshk: 'explanation',
        },
        content: convertLanguageDataToLiSC(sense.explanation, true),
      },
      {
        tag: 'div',
        data: {
          wordshk: 'examples',
        },
        content: exampleNodes,
      },
    ],
  };
}

/**
 * Converts an example list to a ul structured content object with the appropriate emoji.
 * @param {LanguageData[]} languageDatas
 * @param {'phrase' | 'sentence'} exampleType
 * @param {string} exampleText
 * @param {string} exampleEmoji
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
 */
function convertExampleToSC(
  languageDatas,
  exampleType,
  exampleText,
  exampleEmoji
) {
  return {
    tag: 'ul',
    data: {
      wordshk: exampleType,
    },
    content: [
      {
        tag: 'li',
        style: {
          listStyleType: `"${exampleEmoji}"`,
        },
        data: {
          wordshk: 'example-type-header',
        },
        content: exampleText,
      },
      {
        tag: 'ul',
        data: {
          wordshk: `${exampleType}-list`,
        },
        content: [
          ...languageDatas.map((languageData) => {
            return convertLanguageDataToLiSC(languageData, false);
          }),
        ],
      },
    ],
  };
}

/**
 * Converts one single languageData to structured content representing a definition/example/sentence as an unordered list.
 * @param {LanguageData} languageData
 * @param {boolean} isExplanation whether the languageData is an explanation
 or an example
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
 */
function convertLanguageDataToLiSC(languageData, isExplanation) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const languageDivArray = [];

  for (const language of Object.keys(languageData)) {
    languageDivArray.push(
      ...convertLanguageEntryToListItems(
        // @ts-ignore
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
    tag: 'li',
    style: {
      marginBottom: isExplanation ? '0.3em' : '0.5em',
      listStyleType: isExplanation ? 'none' : 'circle',
    },
    data: {
      wordshk: isExplanation ? 'explanation' : 'example',
    },
    content: languageDivArray,
  };

  return sc;
}

/**
 * Converts a single language entry consisting of multiple language contents to a list of lis
 * @param {Language} language
 * @param {string[]} languageTexts
 * @param {boolean} isExplanation whether the languageData is an explanation
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
 */
function convertLanguageEntryToListItems(
  language,
  languageTexts,
  isExplanation
) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const languageLiScArray = [];
  const languageInfo = languages[language];
  for (const languageText of languageTexts) {
    /**
     * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
     */
    const liChildren = [convertTextToSC(languageText, language)];

    // Only push lang tag if non yue/eng language
    const noLanguageTagNecessaryLanguages = ['yue', 'eng'];
    if (!noLanguageTagNecessaryLanguages.includes(language)) {
      liChildren.unshift({
        tag: 'span',
        data: {
          wordshk: 'langSignifier',
        },
        style: {
          color: '#888',
          fontSize: '0.8em',
        },
        content: `${languageInfo.name}› `,
      });
    }

    /**
     * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
     */
    const singleLanguageLi = {
      tag: 'li',
      lang: languageInfo.langCode,
      content: liChildren,
      style: {
        listStyleType: 'none',
      },
      data: {
        wordshk: languageInfo.langCode,
      },
    };

    // Change text size for selected languages
    const cjkLangs = ['yue', 'zho', 'jpn', 'kor', 'lzh'];
    const isCJK = cjkLangs.includes(language);
    // @ts-ignore
    singleLanguageLi.style.fontSize = isCJK
      ? '1.2em'
      : isExplanation
      ? '1em'
      : '0.75em';

    languageLiScArray.push(singleLanguageLi);
  }

  return languageLiScArray;
}

export { convertSenseToLiSC };
