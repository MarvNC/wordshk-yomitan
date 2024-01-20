const punctuations = [
  '，',
  ',',
  '。',
  '.',
  '？',
  '?',
  '！',
  '!',
  '；',
  ';',
  '：',
  ':',
  '、',
  ',',
  '，',
  '⋯',
];

/**
 * Returns true if the text is a Chinese character.
 * @param {string} text
 * @returns {boolean}
 */
function isHanzi(text) {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(
    text
  );
}

/**
 * Returns true if the text is a Jyutping reading.
 * @param {string} text
 * @returns {boolean}
 */
function isJyuutping(text) {
  return /[a-zA-Z0-9]/.test(text);
}

/**
 * Returns true if the text is a punctuation.
 * @param {string} text
 * @returns {boolean}
 */
function isPunctuation(text) {
  return punctuations.includes(text);
}

function isStringSentence(text) {
  // Check if text ends with a punctuation
  const lastChar = text[text.length - 1];
  return isPunctuation(lastChar);
}

export { punctuations, isHanzi, isJyuutping, isPunctuation, isStringSentence };
