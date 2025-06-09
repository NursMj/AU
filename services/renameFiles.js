import { promises as fs } from 'fs';
import path from 'path';
import { toCode } from './utils';

const conditionToRenameFile = (file) => {
	// return file.includes('SUR')
	return true;
};

const renameFunction = (file) => {
	return toCode(file)
		.replace('_light', '')
		.replace('_dark', '')
		.replace('_ff', '_1F')
		.replace('_gf', '_GF')
		.replace('_bf', '_BF');
	// return file.replace('.png', '.jpg')
	// return file
};

const allFilesName = [];

async function renameFiles(dir, outputDir) {
	try {
		// Ensure the output directory exists
		await fs.mkdir(outputDir, { recursive: true });

		const files = await fs.readdir(dir);

		for (const file of files) {
			const filePath = path.join(dir, file);

			try {
				const stats = await fs.stat(filePath);

				if (stats.isDirectory()) {
					// Recursively handle subdirectories
					const subDirOutput = path.join(outputDir, file);
					await renameFiles(filePath, subDirOutput);
				} else if (stats.isFile()) {
					if (conditionToRenameFile(file)) {
						const newFileName = renameFunction(file);
						const newFilePath = path.join(outputDir, newFileName);

						if (!allFilesName.some(([name]) => name === newFileName)) {
							allFilesName.push([newFileName, file]);
						}

						await fs.copyFile(filePath, newFilePath);
						console.log(`Copied and renamed: ${filePath} -> ${newFilePath}`);
					}
				}
			} catch (err) {
				console.error(`Unable to get file stats: ${err}`);
			}
		}
	} catch (err) {
		console.error(`Unable to scan directory: ${err}`);
	}
	console.log('allFilesName :>> ', allFilesName);
}

const inputDir = './input/filesToRename';
const outputDir = './output/filesToRename';

renameFiles(inputDir, outputDir);
