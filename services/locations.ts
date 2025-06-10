import xlsx from 'node-xlsx';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { toCode, getCurrentDir, excelColLetterToIndex } from './utils';

const __dirname = getCurrentDir(import.meta);

type TLocation = any
type TLocationsInfo = Record<string, TLocation>


const locationsInfo: TLocationsInfo = {};

const outputDir = path.join(__dirname, '../output');
const inputDir = path.join(__dirname, '../input');
const outputFilePath = path.join(outputDir, 'locationsOutput.js');

let obj = xlsx.parse(inputDir + '/Locations.xlsx');
let data = obj[0].data.slice(1);

// console.log('data.slice(0,2) :>> ', data.slice(0, 2));

const projects: string[] = [];
const categories: string[] = [];
const locations: string[] = [];

data.forEach((row) => {
	const name = row[excelColLetterToIndex('A')];

	if (!name) return;

	const projectKey = toCode(name);
	const category = toCode(row[excelColLetterToIndex('B')]);
	const location = row[excelColLetterToIndex('C')];
	const location_link = row[excelColLetterToIndex('D')];
	const text = row[excelColLetterToIndex('E')];
	const website = row[excelColLetterToIndex('F')];
	const vrTour = row[excelColLetterToIndex('G')];

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
	outputFilePath,
	`// File Record Time: ${new Date()} \n\nexport default ` +
		util.inspect(
			{ projects, locations, categories, locationsInfo },
			{ showHidden: false, depth: null, maxArrayLength: null }
		)
);

console.log(`\nFinal result!\nThe result is written to a file at this path: ${outputFilePath}`);