import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const toCode = (str: string) =>
	str
		?.toLowerCase()
		.trim()
		.replaceAll(/\s/g, '_')
		.replaceAll('/', '_')
		.replaceAll("'", '')
		.replace(/_+/g, '_')
		.replace('’', '');

export function getCurrentDir(meta: {url: any}) {
	return dirname(fileURLToPath(meta.url));
}

export function getCurrentFile(meta: {url: any}) {
	return fileURLToPath(meta.url);
}
