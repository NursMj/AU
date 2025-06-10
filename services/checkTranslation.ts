import translation from '../input/translation/translation.js';
import translationConsumer from '../input/translation/translationConsumer.js';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { getCurrentDir } from './utils/index.js';

const __dirname = getCurrentDir(import.meta);

const translationKeys = Object.keys(translation);
const missingTranslations: string[] = [];
const typeAndLvl: Record<string, string> = {};

type TMark = {
    text: string;
};

type FloorData = {
    labels: TMark[];
};

type FloorStructure = {
    [floorKey: string]: FloorData;
};

type TranslationConsumer = {
    [typeKey: string]: FloorStructure;
};

Object.entries(translationConsumer as TranslationConsumer).forEach(([typeKey, type]) => {
	Object.entries(type).forEach(([floorKey, floors]) => {
		Object.entries(floors).forEach(([markGroupKey, markGroupValue]) => {
			if (markGroupKey === 'labels') {
				markGroupValue.forEach((item: TMark) => {
					if (!translationKeys.includes(item.text) && !missingTranslations.includes(item.text)) {
						missingTranslations.push(item.text);
						typeAndLvl[item.text] = typeKey + '_' + floorKey;
					}
				});
			}
		});
	});
});

console.log('missingTranslations :>> ', missingTranslations);
console.log('typeAndLvl :>> ', typeAndLvl);

const outputDir = path.join(__dirname, '../output');
const outputFilePath = path.join(outputDir, 'missingTranslations.js');

fs.writeFileSync(
	outputFilePath,
	`// File Record Time: ${new Date()} \n\nexport default ` +
		util.inspect(missingTranslations, { showHidden: false, depth: null, maxArrayLength: null })
);
