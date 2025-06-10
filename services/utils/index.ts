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

export const getCurrentDir = (meta: { url: any }) => {
	return dirname(fileURLToPath(meta.url));
};

export const getCurrentFile = (meta: { url: any }) => {
	return fileURLToPath(meta.url);
};

export const excelColLetterToIndex = (letter: string) =>
	[...letter.toUpperCase()].reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0) - 1;
