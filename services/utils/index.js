import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const toCode = (str) =>
	str
		?.toLowerCase()
		.trim()
		.replaceAll(/\s/g, '_')
		.replaceAll('/', '_')
		.replaceAll("'", '')
		.replace(/_+/g, '_')
		.replace('’', '');

export function getCurrentDir(meta) {
	return dirname(fileURLToPath(meta.url));
}

export function getCurrentFile(meta) {
	return fileURLToPath(meta.url);
}
