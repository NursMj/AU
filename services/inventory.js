import xlsx from 'node-xlsx';
import fs from 'fs';
import util from 'util';
import path from 'path';
import unitsInfoInput from '../input/unitsInfo.js';
import { getCurrentDir, toCode } from './utils/index.js';

const __dirname = getCurrentDir(import.meta);

const unitsInfoOutput = {};

const outputDir = path.join(__dirname, '../output');
const inputDir = path.join(__dirname, '../input');
const filePath = path.join(outputDir, 'inventoryOutput.js');

const excelColLetterToIndex = (letter) =>
	[...letter.toUpperCase()].reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0) - 1;

let obj = xlsx.parse(inputDir + '/List.xlsx');
let data = obj[3].data.slice(8);

// console.log('data.slice(0,2) :>> ', data.slice(0, 2));

const allUnitKesFromList = [];
const allUnitKesFromUnitsInfo = [];

Object.entries(unitsInfoInput).forEach(([key, _]) => {
	allUnitKesFromUnitsInfo.push(key);
});

data.forEach((row) => {
	const unitNumber = row[excelColLetterToIndex('C')];
	// if (!unitNumber || !unitNumber.includes("A1") || !unitNumber.includes("A2")) return
	const unitKey = unitNumber?.replace('A', '')?.replace('-', '')?.trim();

	if (!/^\d{4,5}$/.test(unitKey)) {
		// console.log('Not tipical unit number :>> ', [unitNumber, unitKey])
		return;
	}

	allUnitKesFromList.push(unitKey);

	const internal_area = row[excelColLetterToIndex('F')];
	const balcony_area = row[excelColLetterToIndex('G')] || row[excelColLetterToIndex('H')];
	const saleable_area = row[excelColLetterToIndex('I')];

	if (unitsInfoInput[unitKey]) {
		if (!internal_area) console.log('Error internal_area :>> ', [unitNumber, internal_area]);
		if (!balcony_area) console.log('Error balcony_area :>> ', [unitNumber, balcony_area]);
		if (!saleable_area) console.log('Error saleable_area :>> ', [unitNumber, saleable_area]);

		unitsInfoOutput[unitKey] = {
			...unitsInfoInput[unitKey],
			internal_area,
			balcony_area,
			saleable_area,
		};
	}
});

const missingUnitKeys = [];
const missingUnitKeys1 = [];

allUnitKesFromList.forEach((listKey) => {
	if (!allUnitKesFromUnitsInfo.includes(listKey)) missingUnitKeys.push(listKey);
});

allUnitKesFromUnitsInfo.forEach((listKey) => {
	if (!allUnitKesFromList.includes(listKey)) missingUnitKeys1.push(listKey);
});

fs.writeFileSync(
	filePath,
	`// File Record Time: ${new Date()} \n\nexport default ` +
		// util.inspect(unitsInfoOutput, { showHidden: false, depth: null, maxArrayLength: null })
		util.inspect(
			{ missingUnitKeys, missingUnitKeys1, unitsInfoOutput },
			{ showHidden: false, depth: null, maxArrayLength: null }
		)
);
