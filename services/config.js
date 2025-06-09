import fs from 'fs';
import util from 'util';
import path from 'path';
import { getCurrentDir } from './utils';

const __dirname = getCurrentDir(import.meta);

const inputDir = path.join(__dirname, '../input/filesToDeriveConfig');
const outputDir = path.join(__dirname, '../output');
const outputFilePath = path.join(outputDir, 'galleryCfgOutput.js');

const skipDirs = ['pdf_file', 'Preview'];
const skipFiles = ['Thumbs.db', "Yamm Beach Villas.pdf"];

// const all = [
// 	'1 Waterfront View.jpg',
// 	'2 Waterfront View.jpg',
// 	'3 Arrival View.jpg',
// 	'4 Residential Marina Overlook.jpg',
// 	'5 Residential Side View.jpg',
// 	'6 Waterfront Tower.jpg',
// 	'7 Side View.jpg',
// 	'8 Marina Promenade.jpg',
// 	'9 Elevation.jpg',
// 	'10 Facade.jpg',
// 	'11 Facade.jpg',
// 	'12 Side View.jpg',
// 	'13 Front Elevation.jpg',
// 	'14 Front Elevation.jpg',
// 	'15 Drop Off.jpg',
// 	'16 Drop Off.jpg',
// 	'17 F&B Island-Tower.jpg',
// 	'18 F&B Canopy.jpg',
// 	'19 F&B Waterfront.jpg',
// 	'20 Balcony View.jpg',
// 	'21 Amenity 1F.jpg',
// 	'22 Residential Lobby.jpg',
// 	'23 Residential Lobby.jpg',
// 	'24 Meeting Table.jpg',
// 	'25 Double Height Space.jpg',
// 	'26 Office Lobby A.jpg',
// 	'27 Office Lobby B.jpg',
// 	'28 Office Lobby C.jpg',
// 	'29 Office Lobby D.jpg',
// 	'30 Dining & Living Room.jpg',
// ];

const cfg = {};

function removeFirstWordIfNumber(str) {
	const words = str.trim().split(/\s+/);
	if (words.length > 0 && !isNaN(words[0])) {
		return words.slice(1).join(' ');
	}
	return str;
}

function getFilesPathsSync(dir) {
	const allFilesName = [];
	try {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const filePath = path.join(dir, file);
			try {
				const stats = fs.statSync(filePath);

				if (stats.isDirectory()) {
					// Skip if directory is in skipDirs or is hidden (when skipHidden is true)
					if (skipDirs.includes(file)) {
						continue;
					}
					// Recursively handle subdirectories
					const subDirFiles = getFilesPathsSync(filePath);
					allFilesName.push(...subDirFiles);
				} else if (stats.isFile()) {
					if (!skipFiles.includes(file)) {
						const parsedPath = path.parse(filePath);
						const dirName = path.basename(parsedPath.dir);
						const parentDir = path.basename(path.dirname(parsedPath.dir));
						const grandparentDir = path.basename(path.dirname(path.dirname(parsedPath.dir)));

						allFilesName.push([
							filePath, // parentDir path
							grandparentDir, // grandparent directory name
							parentDir, // parent directory name
							dirName, // immediate directory name
							file, // filename
						]);
					}
				}
			} catch (err) {
				console.error(`Unable to get file stats for ${filePath}:`, err);
			}
		}
	} catch (err) {
		console.error(`Unable to scan directory ${dir}:`, err);
	}
	return allFilesName;
}

const all = getFilesPathsSync(inputDir);

// console.log('all :>> ', all);

all.forEach((file) => {
	const [filePath, grandparentDir, parentDir, dirName, fileName] = file;
    
    if (fileName === "Thumbs.db") return

    const isVideo = fileName.includes('.mp4')
    if (dirName.toLowerCase() === 'animation' && !isVideo) return
    const imageFile = fileName.replace('.mp4', '.jpg')
	const imgSrc = `./images/gallery/${grandparentDir}/Full/${dirName}/${imageFile}`;
	const prevSrc = `./images/gallery/${grandparentDir}/Preview/${dirName}/${imageFile}`;
	const title = removeFirstWordIfNumber(imageFile.replace('.jpg', ''));
    const videoSrc = isVideo ? `./images/gallery/${grandparentDir}/Full/${dirName}/${fileName}` : false;

	// const type = dirName.split(' ').slice(-1)[0].toLowerCase()

	if (!cfg[grandparentDir]) cfg[grandparentDir] = {};
	if (!cfg[grandparentDir][dirName]) cfg[grandparentDir][dirName] = [];

	cfg[grandparentDir][dirName].push({
		src: imgSrc,
		thumb: prevSrc,
		w: 1920,
		h: 1080,
		title,
		desc: '',
		mode: 'contain',
		isVideo,
		videoSrc,
	});
});

fs.writeFileSync(
	outputFilePath,
	`// File Record Time: ${new Date()} \n\nexport default ` +
		util.inspect(cfg, { showHidden: false, depth: null, maxArrayLength: null })
);
