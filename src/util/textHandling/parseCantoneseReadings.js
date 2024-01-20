import {
  punctuations,
  isHanzi,
  isJyuutping,
  isPunctuation,
} from './textUtils.js';

/**
 * Parses a text string into an array matching each character to the readings
 * @example text: "你get唔get到我講咩？"
 * reading: "nei5 get1 m4 get1 dou2 ngo5 gong2 me1?"
 * =>
 * [{text: "你", reading: "nei5"}, {text: "get", reading: "get1"}, ...]
 * @param {string} text
 * @param {string} readings
 * @returns {TextReadingPair[]}
 */
function parseCantoneseReadings(text, readings) {
  /**
   * @type {TextReadingPair[]}
   */
  const resultArray = [];

  const textArray = splitString(text, punctuations);
  const readingsArray = splitString(readings, punctuations);

  let readingIndex = 0;
  let textIndex = 0;
  for (let i = 0; i < Math.max(textArray.length, readingsArray.length); i++) {
    const text = textArray[textIndex];
    const reading = readingsArray[readingIndex];
    const isTextHanzi = isHanzi(text);
    const isReadingJyuutping = isJyuutping(reading);
    const isTextPunctuation = isPunctuation(text);
    const isReadingPunctuation = isPunctuation(reading);
    // Ideal case
    if (
      (isTextHanzi && isReadingJyuutping) ||
      (isTextPunctuation && isReadingPunctuation) ||
      // Case where for example text is 'bu' and reading is 'bu4'
      (!isTextHanzi && !isTextPunctuation && isReadingJyuutping)
    ) {
      resultArray.push({ text, reading });
      textIndex++;
      readingIndex++;
    } else if (isTextPunctuation && isReadingJyuutping) {
      // Send empty string to reading
      resultArray.push({ text, reading: '' });
      textIndex++;
    } else {
      throw new Error(
        `Unexpected text "${text}" and reading "${reading}" at index ${i}`
      );
    }
  }
  // Check if remaining text in either array
  if (textIndex !== textArray.length) {
    throw new Error(
      `Unexpected text "${textArray[textIndex]}" at index ${textIndex}`
    );
  }
  if (readingIndex !== readingsArray.length) {
    throw new Error(
      `Unexpected reading "${readingsArray[readingIndex]}" at index ${readingIndex}`
    );
  }

  return resultArray;
}

/**
 *
 * @param {string} input
 * @param {string[]} punctuations
 * @returns {string[]}
 */
function splitString(input, punctuations) {
  const resultArray = [];
  let current = '';
  for (const char of input) {
    if (/[a-zA-Z0-9]/.test(char)) {
      current += char;
    } else if (punctuations[char]) {
      if (current) {
        resultArray.push(current);
        current = '';
      }
      resultArray.push(char);
    } else {
      if (current) {
        resultArray.push(current);
        current = '';
      }
      resultArray.push(char);
    }
  }
  // Push the last current
  if (current) {
    resultArray.push(current);
  }

  // Remove empty strings
  const resultArrayFiltered = resultArray
    .map((item) => item.trim())
    .filter((item) => item);
  return resultArrayFiltered;
}

export { parseCantoneseReadings };
