import fs from 'fs';
import util from 'util';
import path from 'path';
import { getCurrentDir } from './utils';

const __dirname = getCurrentDir(import.meta);

const unitsInfo = {};

const allDataUnits = {
	G1_1: [
		'G1_1121',
		'G1_1120',
		'G1_1119',
		'G1_1118',
		'G1_1117',
		'G1_1116',
		'G1_1115',
		'G1_1114',
		'G1_1113',
		'G1_1112',
		'G1_1111',
		'G1_1110',
		'G1_1109',
		'G1_1108',
		'G1_1107',
		'G1_1106',
		'G1_1105',
		'G1_1104',
		'G1_1103',
		'G1_1102',
		'G1_1101',
	],
	G1_2: [
		'G1_2121',
		'G1_2120',
		'G1_2119',
		'G1_2118',
		'G1_2117',
		'G1_2114',
		'G1_2113',
		'G1_2112',
		'G1_2111',
		'G1_2110',
		'G1_2109',
		'G1_2108',
		'G1_2107',
		'G1_2107S', // Duplicate
		'G1_2106',
		'G1_2106S', // Duplicate
		'G1_2105',
		'G1_2104',
		'G1_2103',
		'G1_2102',
		'G1_2101',
	],
	G1_3: [
		'G1_3121',
		'G1_3120',
		'G1_3119',
		'G1_3118',
		'G1_3118S', // Duplicate
		'G1_3117',
		'G1_3117S', // Duplicate
		'G1_3116',
		'G1_3115',
		'G1_3114',
		'G1_3113',
		'G1_3112',
		'G1_3111',
		'G1_3110',
		'G1_3109',
		'G1_3108',
		'G1_3107',
		'G1_3106',
		'G1_3105',
		'G1_3104',
		'G1_3103',
		'G1_3102',
		'G1_3101',
	],
};

Object.entries(allDataUnits).forEach(([tower, towerunits]) => {
	towerunits.forEach((unit) => {
		const unitKey = unit;
		const [tower_group, landNumber] = unit.split('_');
		const floor = landNumber[1];

		unitsInfo[unitKey] = {
			available: true,
			unitKey,
			bedrooms: '3',
			tower,
			floor,
			tower_group,
			landNumber,
			unit_type: 'L_2R',
			type: 'Simplex',
			internal_area: 76.55217904291196,
			external_area: 17.279982162599058,
			total_area: 93.83216120551101,
		};
	});
});

const outputDir = path.join(__dirname, '../output');
const filePath = path.join(outputDir, 'itirateOutput.js');

fs.writeFileSync(
	filePath,
	`// File Record Time: ${new Date()}
	export default ` + util.inspect(unitsInfo, { showHidden: false, depth: null, maxArrayLength: null })
);
