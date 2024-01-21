/**
 * Given a list of dictionary entries, find all unique labels.
 * @param {DictionaryEntry[]} dictionaryEntries
 * @returns {Set<string>} Set of unique labels
 */
function findAllLabels(dictionaryEntries) {
  const uniqueLabels = new Set();
  for (const entry of dictionaryEntries) {
    for (const tag of entry.tags) {
      if (tag.name === 'label') {
        uniqueLabels.add(tag.value);
      }
    }
  }
  console.log(`Found ${uniqueLabels.size} unique labels.`);
  return uniqueLabels;
}

export { findAllLabels };
