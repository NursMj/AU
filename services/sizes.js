const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { toCode } = require('./utils')


const unitsInfo = require('../input/unitsInfo.js');

const outputDir = path.join(__dirname, '../output');
const inputDir = path.join(__dirname, '../input');
const outputFilePath = path.join(outputDir, `sizesOutput.js`);

const obj = xlsx.parse(inputDir + '/Sizes.xlsx');
const data = obj[1].data.slice(1);

const typesInfo = {};
const tooltipInfo = {};

let currentType;
let currentFloor;

let currentProject;

data.forEach((lm) => {
	const [lmName, project, min, km] = lm;

	let _project = toCode(project);

	if (!lmName) return;

	if (_project) {
		currentProject = _project;
	} else {
		_project = currentProject;
	}

	const lmCode = toCode(lmName);

	if (typesInfo[lmCode]) {
		typesInfo[lmCode].distance[_project] = {
			en: `${min} min | ${km} km`,
			ar: `${min} كم | ${km} الدقائق`,
		};
		return;
	}

	const lmObj = {
		title: {
			en: lmName,
			ar: lmName,
		},
		description: {
			en: 'Description',
			ar: 'Description',
		},
		distance: {
			[_project]: {
				en: `${min} min | ${km} km`,
				ar: `${min} كم | ${km} الدقائق`,
			},
		},
		image: {
			desktop: `./images/landmarks/yas_island/desktop/${lmCode}.jpg`,
			mobile: `./images/landmarks/yas_island/mobile/${lmCode}.jpg`
		},
	};

	typesInfo[lmCode] = lmObj;
});

// data.forEach((room) => {
// 	const [type, floor, popupVR, roomName, height, width, length, area] = room;

// 	let _type = type
// 	let _floor = floor === 'FF' ? '1F' : floor

// 	if (!roomName) return;

// 	if (_type) {
// 		currentType = _type;
// 		typesInfo[currentType] = {}
// 	} else {
// 		_type = currentType;
// 	};

// 	if (_floor) {
// 		currentFloor = _floor;
// 		typesInfo[currentType][currentFloor] = {}
// 	} else {
// 		_floor = currentFloor;
// 	};

// 	if (popupVR && popupVR !== 'No pop-up') {

// 		if (!tooltipInfo[_type]) {
// 			tooltipInfo[_type] = {}
// 		};

// 		const tooltipObj = {
// 			area: Math.round(parseFloat(area) * 100) / 100,
// 			length: parseFloat(length),
// 			width: parseFloat(width),
// 			height: parseFloat(height),
// 			color: 'dark',
// 		};

// 		tooltipInfo[_type][popupVR] = tooltipObj;
// 	}

// 	const roomCode = roomName.toLowerCase().trim().replaceAll(/\s/g, '_').replaceAll('/', '_').replaceAll("'", '').replace(/_+/g, '_');
// 	const roomObj = { x: parseFloat(length), y: parseFloat(width) };

// 	if (!roomObj.x || !roomObj.y) {
// 		console.log(`Somthin wrong with _type: ${_type}, room: ${roomName}`)
// 		console.log('roomObj :>> ', roomObj);
// 	}

// 	typesInfo[_type][_floor][roomCode] = roomObj;

// 	// if (floor) {
// 	// 	currentFloor = floor;
// 	// 	typesInfo[currentType][currentFloor] = {};
// 	// }

// 	// const [x, y] = extractNumbers(size);

// 	// if (!x || !y) console.log(`Somthin wrong with _type: ${currentType}, floor: ${currentFloor}, room: ${roomName}`)

// 	// if (x && y) typesInfo[currentType][currentFloor][roomCode] = { x, y };
// });

fs.writeFileSync(
	outputFilePath,
	`// File Record Time: ${new Date()} \n\nexport default ` +
		util.inspect({ typesInfo, tooltipInfo }, { showHidden: false, depth: null, maxArrayLength: null })
);
