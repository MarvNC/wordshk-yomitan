import path from 'path';
import fs from 'fs';

/**
 * Get the version from the package.json file.
 * @returns {string} The version.
 */
export function getVersion() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}
