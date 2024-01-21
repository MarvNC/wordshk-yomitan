import XRegExp from '@gerhobbelt/xregexp';

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
  XRegExp.install('astral');
  return XRegExp(
    '\\p{InCJK_Unified_Ideographs}|\\p{InCJK_Unified_Ideographs_Extension_A}|\\p{InCJK_Unified_Ideographs_Extension_B}|\\p{InCJK_Unified_Ideographs_Extension_C}|\\p{InCJK_Unified_Ideographs_Extension_D}|\\p{InCJK_Unified_Ideographs_Extension_E}'
  ).test(text);
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
