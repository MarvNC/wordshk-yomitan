import { parseCantoneseReadings } from '../textHandling/parseCantoneseReadings.js';

/**
 * Parses a text string into a structured content object.
 * @param {string} rawText
 * @param {string} languageCode
 * @returns {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
 */
function convertTextToSC(rawText, languageCode) {
  const rubyTextLangs = ['yue', 'zho', 'lzh'];
  const cleanedText = cleanRawText(rawText);
  if (!rubyTextLangs.includes(languageCode)) {
    return cleanedText;
  }
  // Parse brackets for possible reading
  const bracketRegex = /(.+)\(([^\(\)]+)\)$/;
  const [_, phrase, reading] = cleanedText.match(bracketRegex) || [];

  if (!phrase || !reading) {
    return cleanedText;
  }

  // If reading doesn't have alphanumeric characters, it's not a jyut reading
  const hasEnglishChars = /[a-zA-Z0-9]/.test(reading);
  if (!hasEnglishChars) {
    return cleanedText;
  }

  try {
    const readings = parseCantoneseReadings(phrase, reading);
    return readings.map(convertReadingToRubySC);
  } catch (error) {
    return cleanedText;
  }
}

/**
 * Strips out # and spaces from raw text
 * @param {string} rawText
 */
function cleanRawText(rawText) {
  return rawText.replace(/#| /g, '');
}

/**
 * Parses a text string into a structured content object with ruby text for readings
 * @param {TextReadingPair} reading
 * @returns {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
 */
function convertReadingToRubySC(reading) {
  return {
    tag: 'ruby',
    content: [
      reading.text,
      {
        tag: 'rt',
        content: reading.reading,
      },
    ],
  };
}

export { convertReadingToRubySC, convertTextToSC };
