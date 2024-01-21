/**
 * @type {Record<string, string>}
 */
const tagValueToNote = {
  // Parts of speech
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
  術語: 'term',
  // Labels
  馬來西亞: 'Malaysia',
  粗俗: 'vulgar',
  香港: 'Hong Kong',
  專名: 'proper noun',
  俚語: 'slang',
  潮語: 'trendy expression',
  外來語: 'loanword',
  書面語: 'written language',
  舊式: 'old-fashioned',
  大陸: 'Mainland China',
  文言: 'classical Chinese',
  gpt: 'GPT',
  台灣: 'Taiwan',
  爭議: 'controversial',
  黃賭毒: 'vice',
  日本: 'Japan',
  口語: 'colloquial',
  錯字: 'misspelling',
  玩嘢: 'playful',
  民間傳説: 'folklore',
  澳門: 'Macau',
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
async function addYomitanTags(dictionary, uniqueLabels) {
  let tagsAdded = 0;
  const noNoteAvailable = new Set();
  for (const [labelName, labelValues] of Object.entries(uniqueLabels)) {
    for (const value of labelValues) {
      await dictionary.addTag({
        name: value,
        category: categoryToYomitanLabelCategoryMap[labelName] ?? labelName,
        notes: tagValueToNote[value] ?? value,
        sortingOrder: categoryToSortingOrder[labelName] ?? 0,
      });
      if (!tagValueToNote[value]) {
        noNoteAvailable.add(value);
      }
      tagsAdded++;
    }
  }
  console.log(`Added ${tagsAdded} tags to dictionary.`);
  if (noNoteAvailable.size) {
    console.warn(`No note available for: ${[...noNoteAvailable].join(', ')}`);
  }
}

export { addYomitanTags };
