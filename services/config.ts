import fs from 'fs';
import util from 'util';
import path from 'path';
import { getCurrentDir } from './utils';

const __dirname = getCurrentDir(import.meta);

const inputDir = path.join(__dirname, '../input/filesToDeriveConfig');
const outputDir = path.join(__dirname, '../output');
const outputFilePath = path.join(outputDir, 'galleryCfgOutput.js');

const skipDirs = ['pdf_file', 'Preview'];
const skipFiles = ['Thumbs.db', 'Yamm Beach Villas.pdf'];

type TItem = {
	src: string;
	thumb: string;
	w: 1920;
	h: 1080;
	title: string;
	desc: string;
	mode: string;
	isVideo: boolean;
	videoSrc: string | false;
};

type CfgStructure = {
	[typeKey: string]: {
		[subtypeKey: string]: TItem[];
	};
};

const cfg: CfgStructure = {};

function removeFirstWordIfNumber(str: string) {
	const words = str.trim().split(/\s+/);
	if (words.length > 0 && !isNaN(+words[0])) {
		return words.slice(1).join(' ');
	}
	return str;
}

function getFilesPathsSync(dir: string) {
	const allFilesName: string[][] = [];
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

	if (fileName === 'Thumbs.db') return;

	const isVideo = fileName.includes('.mp4');
	if (dirName.toLowerCase() === 'animation' && !isVideo) return;
	const imageFile = fileName.replace('.mp4', '.jpg');
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

console.log(`\nFinal result!\nThe result is written to a file at this path: ${outputFilePath}`);