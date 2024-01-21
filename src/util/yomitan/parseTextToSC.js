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
  const cleanedText = cleanRawText(rawText);
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
    return readings.map(({ text, reading }) =>
      convertReadingToRubySC(text, reading)
    );
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
 * @param {string} text
 * @param {string} reading
 * @returns {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
 */
function convertReadingToRubySC(text, reading) {
  // Check that both text and reading are type string, if not then cast to string
  if (typeof text !== 'string') {
    text = String(text);
  }
  if (typeof reading !== 'string') {
    reading = String(reading);
  }
  return {
    tag: 'ruby',
    content: [
      text,
      {
        tag: 'rt',
        content: reading,
      },
    ],
  };
}

export { convertReadingToRubySC, convertTextToSC };
