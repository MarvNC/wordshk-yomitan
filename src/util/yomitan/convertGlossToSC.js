import { languages } from '../../constants';
import { isStringSentence } from '../textHandling/textUtils';

const examplePhraseText = '配詞 / 用法';
const exampleSentenceText = '例句';
const examplePhraseEmoji = '💬';
const exampleSentenceEmoji = '📝';

/**
 * Converts a gloss to structured content.
 * @param {Gloss} gloss
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
 */
function convertGlossToSC(gloss) {
  /**
   * @type {LanguageData[]}
   */
  const phrases = [];
  /**
   * @type {LanguageData[]}
   */
  const sentences = [];
  for (const eg of gloss.egs) {
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
  return {
    tag: 'ul',
    data: {
      wordshk: 'gloss',
    },
    lang: 'yue',
    content: [
      {
        tag: 'div',
        data: {
          wordshk: 'definition',
        },
        content: convertLanguageDataToUlSC(gloss.explanation, true),
      },
      {
        tag: 'div',
        data: {
          wordshk: 'examples',
        },
        content: [
          {
            tag: 'div',
            data: {
              wordshk: 'phrase',
            },
            content: [
              {
                tag: 'span',
                content: examplePhraseText,
                style: {
                  listStyleType: `"${examplePhraseEmoji}"`,
                },
              },
              ...phrases.map((phrase) => {
                return convertLanguageDataToUlSC(phrase, true);
              }),
            ],
          },
          {
            tag: 'div',
            data: {
              wordshk: 'sentence',
            },
            content: [
              {
                tag: 'span',
                content: exampleSentenceText,
                style: {
                  listStyleType: `"${exampleSentenceEmoji}"`,
                },
              },
              ...sentences.map((sentence) => {
                return convertLanguageDataToUlSC(sentence, false);
              }),
            ],
          },
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
  /**
   * @type {string[]}
   */
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
      // TODO: use textParser function when built
      content: languageText,
    };
    // Make text larger for selected languages
    const cjkLangs = ['yue', 'zho', 'jpn', 'kor', 'lzh'];
    if (cjkLangs.includes(language) && !isExplanation) {
      textSpan.style = {
        fontSize: '120%',
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

export { convertGlossToSC, convertLanguageDataToUlSC };