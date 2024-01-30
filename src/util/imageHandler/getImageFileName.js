import { createHash } from 'crypto';

/**
 * Hashes the image URL to get the image file name, preserving the file extension.
 * @param {string} imageURL
 */
function getImageFileName(imageURL) {
  const hash = createHash('sha256');
  hash.update(imageURL);
  const hashed = hash.digest('hex');
  const extension = imageURL.split('.').pop()?.toLocaleLowerCase() || '';
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`Invalid extension: ${extension}`);
  }
  return `${hashed}.${extension}`;
}

export { getImageFileName };