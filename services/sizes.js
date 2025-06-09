import xlsx from 'node-xlsx';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { getCurrentDir, toCode } from './utils/index.js';

const __dirname = getCurrentDir(import.meta);

const unitsInfo = require('../input/unitsInfo.js');

const outputDir = path.join(__dirname, '../output');
const inputDir = path.join(__dirname, '../input');
const outputFilePath = path.join(outputDir, `sizesOutput.js`);

const obj = xlsx.parse(inputDir + '/Sizes.xlsx');
const headerRows = 1;
const data = obj[0].data.slice(headerRows);

let typesInfo = {};
let currentLevelType = null;
let currentType = null;

// console.log(data.slice(0, 2))

const setSyzeTypeForUnits = (arr, typeForSezes) => {
	arr.forEach((unit) => {
		const unitKey = 'BA_' + unit;
		if (unitsInfo[unitKey]) {
			unitsInfo[unitKey].type_for_sizes = typeForSezes;
		} else {
			console.log('no units info for :>> ', unitKey);
		}
	});
};

data.forEach((row, i) => {
	const [levelType, _, unitType, unitNumbers, roomName, width, length] = row;

	if (!roomName) return;

	if (levelType) currentLevelType = levelType.replaceAll(',', ' ');
	if (unitType) currentType = unitType;

	const ultraType = toCode(`${currentLevelType} ${currentType}`);

	if (!typesInfo[ultraType]) {
		typesInfo[ultraType] = {};
	}

	if (unitNumbers) {
		const units = String(unitNumbers).replaceAll('.', ',').replaceAll(' ', '').split(',');
		setSyzeTypeForUnits(units, ultraType);
	}

	// const [length, width] = size.replace('х', 'x').replace('×', 'x').replace('  ', 'x').split('x')

	const roomCode = toCode(roomName);
	const roomObj = { x: parseFloat(length) ?? 0, y: parseFloat(width) ?? 0 };

	if ((roomObj.x === 0 && roomObj.y === 0) || (isNaN(roomObj.x) && isNaN(roomObj.y))) return;

	if (!roomObj.x || !roomObj.y) {
		console.log(`Somthin wrong with _type: ${ultraType}, room: ${roomName} on line ${headerRows + i + 1}`);
		console.log('roomObj :>> ', roomObj);
	}

	typesInfo[ultraType][roomCode] = roomObj;
});

fs.writeFileSync(
	outputFilePath,
	`// File Record Time: ${new Date()} \n\nexport default ` +
		util.inspect({ typesInfo, unitsInfo }, { showHidden: false, depth: null, maxArrayLength: null })
);
