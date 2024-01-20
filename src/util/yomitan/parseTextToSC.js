import { parseCantoneseReadings } from '../textHandling/parseCantoneseReadings.js';

/**
 * Parses a text string into a structured content object.
 * @param {string} rawText
 * @param {string} languageCode
 * @returns {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
 */
function convertTextToSC(rawText, languageCode) {
  const rubyTextLangs = ['yue', 'zho', 'lzh'];
  if (!rubyTextLangs.includes(languageCode)) {
    return rawText;
  }
  // Parse brackets for possible reading
  const bracketRegex = /(.+)\(([^\(\)]+)\)$/;
  const [_, phrase, reading] = rawText.match(bracketRegex) || [];

  if (!phrase || !reading) {
    return rawText;
  }

  // If reading doesn't have alphanumeric characters, it's not a jyut reading
  const hasEnglishChars = /[a-zA-Z0-9]/.test(reading);
  if (!hasEnglishChars) {
    return rawText;
  }

  try {
    const readings = parseCantoneseReadings(cleanRawText(phrase), reading);
    return readings.map(convertReadingToRubySC);
  } catch (error) {
    return rawText;
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
