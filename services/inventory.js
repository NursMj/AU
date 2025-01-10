const xlsx = require('node-xlsx');
const fs = require('fs');
const util = require('util');
const path = require('path');

const unitsInfo = require('../input/unitsInfo.js')

const outputDir = path.join(__dirname, '../output');
const inputDir = path.join(__dirname, '../input');
const filePath = path.join(outputDir, 'inventoryOutput.js');

let obj = xlsx.parse(inputDir + '/List.xlsx');
let data = obj[0].data;

const th = data.slice(0, 1)[0];
const trs = data.slice(1, 91);

const types = {};
const typeCurrentMirror = {};
const typeCurrentSUR = {};

th.forEach((cell, i) => {
	if (cell.includes('BR')) types[i + 1] = cell;
});

trs.forEach((row) => {
	row.forEach((cell, i) => {
		if (['Normal', 'Mirror'].includes(cell)) typeCurrentMirror[types[i + 1]] = cell === 'Mirror';
		if (cell.includes('SUR')) typeCurrentSUR[types[i - 1]] = cell.toLowerCase();
		if (Object.keys(types).includes(i.toString())) {
			if (!cell) return
			if (row[i + 1]) typeCurrentSUR[types[i]] = row[i + 1].toLowerCase();

			const unitCode = `SE-R-${cell}`
			
			if (unitsInfo[unitCode]) {
				const isMirror = typeCurrentMirror[types[i]]
				unitsInfo[unitCode].view = typeCurrentSUR[types[i]]
				if (isMirror) unitsInfo[unitCode].mirror = isMirror
			}
		}
	});
});


// const types = [];

// data.map((el) => {
// 	const unitNumber = el[0];
// 	const type = el[2];
// 	const category = type?.includes('V') ? 'villa' : 'townhouse';

// 	console.log('category :>> ', category);

// 	if (!types.includes(type)) types.push(type)

// 	if (unitsInfo?.[unitNumber]) {
// 		unitsInfo[unitNumber].type = type;
// 		unitsInfo[unitNumber].category = category;
// 	}
// });


fs.writeFileSync(
	filePath,
	`// File Record Time: ${new Date()} \n\nexport default ` + util.inspect(unitsInfo, { showHidden: false, depth: null, maxArrayLength: null })
);
