/**
 * Given a list of dictionary entries, find all unique labels.
 * @param {DictionaryEntry[]} dictionaryEntries
 * @returns {Record<string, Set<string>>}
 */
function findLabelValues(dictionaryEntries) {
  const tagCategories = {
    label: new Set(),
    pos: new Set(),
  };
  for (const entry of dictionaryEntries) {
    for (const tag of entry.tags) {
      if (tagCategories[tag.name]) {
        tagCategories[tag.name].add(tag.value);
      }
    }
  }
  console.log(tagCategories);
  return tagCategories;
}

export { findLabelValues };
