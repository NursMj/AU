import xlsx from 'node-xlsx';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { toCode, getCurrentDir } from './utils';

const __dirname = getCurrentDir(import.meta);

const locationsInfo = {};

const outputDir = path.join(__dirname, '../output');
const inputDir = path.join(__dirname, '../input');
const filePath = path.join(outputDir, 'locationsOutput.js');

const excelLetterToIndex = (letter) => [...letter.toUpperCase()].reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0) - 1;

let obj = xlsx.parse(inputDir + '/Locations.xlsx');
let data = obj[0].data.slice(1);

// console.log('data.slice(0,2) :>> ', data.slice(0, 2));

const projects = [];
const categories = [];
const locations = [];

data.forEach((row) => {
	const name = row[excelLetterToIndex('A')];

	if (!name) return;

	const projectKey = toCode(name);
	const category = toCode(row[excelLetterToIndex('B')]);
	const location = row[excelLetterToIndex('C')];
	const location_link = row[excelLetterToIndex('D')];
	const text = row[excelLetterToIndex('E')];
	const website = row[excelLetterToIndex('F')];
	const vrTour = row[excelLetterToIndex('G')];

	projects.push(projectKey);
	if (!categories.includes(category)) categories.push(category);
	if (!locations.includes(location)) locations.push(location);

	locationsInfo[projectKey] = {
		code: projectKey,
		logo: projectKey,
		name,
		category,
		location,
		location_link,
		text,
		website,
		vrTour,
	};
});

fs.writeFileSync(
	filePath,
	`// File Record Time: ${new Date()} \n\nexport default ` +
		util.inspect(
			{ projects, locations, categories, locationsInfo },
			{ showHidden: false, depth: null, maxArrayLength: null }
		)
);
