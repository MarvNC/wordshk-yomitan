/**
 * @type {Record<string, string>}
 */
const tagValueToNote = {
  名詞: 'noun',
  動詞: 'verb',
  語句: 'phrase',
  形容詞: 'adjective',
  量詞: 'classifier',
  感嘆詞: 'interjection',
  代詞: 'pronoun',
  助詞: 'particle',
  語素: 'morpheme',
  區別詞: 'distinguishing word',
  副詞: 'adverb',
  擬聲詞: 'onomatopoeia',
  連詞: 'conjunction',
  詞綴: 'affix',
  介詞: 'preposition',
  數詞: 'numeral',
  方位詞: 'locative',
};

const categoryToYomitanLabelCategoryMap = {
  pos: 'part-of-speech',
};

const categoryToSortingOrder = {
  pos: 1,
};

/**
 * Given a set of unique labels, adds the appropriate tags to the Yomitan dictionary.
 * @param {Dictionary} dictionary
 * @param {Record<string, Set<string>>} uniqueLabels
 */
async function addTags(dictionary, uniqueLabels) {
  for (const [labelName, labelValues] of Object.entries(uniqueLabels)) {
    for (const value of labelValues) {
      await dictionary.addTag({
        name: value,
        category: categoryToYomitanLabelCategoryMap[labelName] ?? labelName,
        notes: tagValueToNote[value] ?? value,
        sortingOrder: categoryToSortingOrder[labelName] ?? 0,
      });
    }
  }
}

export { addTags };
