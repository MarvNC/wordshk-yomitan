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
        content: convertLanguageDataToUlSC(sense.explanation, false),
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
    tag: 'div',
    data: {
      wordshk: exampleType,
    },
    content: [
      {
        tag: 'ul',
        content: {
          tag: 'li',
          content: [
            exampleText,
            ...languageDatas.map((languageData) => {
              return convertLanguageDataToUlSC(languageData, false);
            }),
          ],
        },
        style: {
          listStyleType: `"${exampleEmoji}"`,
        },
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
function convertLanguageDataToUlSC(languageData, isExplanation) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const languageLiScArray = [];

  for (const language of Object.keys(languageData)) {
    languageLiScArray.push(
      ...convertLanguageEntryToLi(
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
 * @param {Language} language
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
  for (const languageText of languageTexts) {
    // Span tag for language text
    /**
     * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
     */
    const textSpan = {
      tag: 'span',
      data: {
        wordshk: 'langtext',
      },
      content: convertTextToSC(languageText, languageInfo.langCode),
    };
    if (!isExplanation) {
      // Change text size for selected languages
      const cjkLangs = ['yue', 'zho', 'jpn', 'kor', 'lzh'];
      const makeSmaller = ['eng'];
      const isCJK = cjkLangs.includes(language);
      textSpan.style = {
        fontSize: isCJK ? '120%' : '80%',
      };
    }
    languageLiScArray.push({
      tag: 'li',
      lang: languageInfo.langCode,
      content: [
        // Span tag for language name/abbreviation
        {
          tag: 'span',
          data: {
            wordshk: 'lang',
          },
          style: {
            color: '#666',
          },
          content: `<${
            isExplanation ? languageInfo.name : languageInfo.shortName
          }> `,
        },
        textSpan,
      ],
      data: {
        wordshk: languageInfo.langCode,
      },
    });
  }

  return languageLiScArray;
}

export { convertSenseToLiSC, convertLanguageDataToUlSC };
