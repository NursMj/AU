import { promises as fs } from 'fs';
import path from 'path';
import { toCode } from './utils';

const conditionToRenameFile = (file) => {
	// return file.includes('SUR')
	return true;
};

const renameFunction = (file) => {
	// return toCode(file)
	// return file.replace('.svg', '_residence_25.svg')
	// return file.replace('.svg', '_ville_11.svg')
	return file.replaceAll('FP_', '').replaceAll('_BS', '_BF').replaceAll('_FF', '_1F').replaceAll('_SF', '_2F');
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
						let newFilePath = path.join(outputDir, newFileName);
						let parts = newFilePath.split(path.sep);

						const secondFromEnd = parts.length - 2; // Index of the second element from the end
						const thirdFromEnd = parts.length - 3; // Index of the third element from the end

						// Swap the elements
						const temp = parts[secondFromEnd];
						parts[secondFromEnd] = parts[thirdFromEnd];
						parts[thirdFromEnd] = temp;

						const indexOfColor = parts.length - 2;
						const color = parts.splice(indexOfColor, 1)[0];

						parts[parts.length - 1] = parts[parts.length - 1].replace('.png', `_${color.toLocaleLowerCase()}.png`);

						const newPath = parts
							.map((p) => {
								if (!p.includes('.png')) {
									if (p.includes('M004')) return 'M004';
									if (p.includes('M005')) return 'M005';
									if (p.includes('M015')) return 'M015';
									if (p.includes('M017')) return 'M017';
									if (p.includes('M018')) return 'M018';
								}
								return p;
							})
							.join(path.sep);

						async function ensureDirectoryExists(dir) {
							try {
								// Check if the directory exists
								await fs.access(dir);
							} catch (err) {
								// If the directory doesn't exist, create it
								if (err.code === 'ENOENT') {
									await fs.mkdir(dir, { recursive: true });
								} else {
									throw err; // Re-throw other errors
								}
							}
						}

						const newDir = path.dirname(newPath);
						await ensureDirectoryExists(newDir);

						//   if (!allFilesName.some(([name]) => name === newFileName)) {
						// 	allFilesName.push([newFileName, file]);
						//   }

						await fs.copyFile(filePath, newPath);
						console.log(`Copied and renamed: ${filePath} -> ${newPath}`);
					}
				}
			} catch (err) {
				console.error(`Unable to get file stats: ${err}`);
			}
		}
	} catch (err) {
		console.error(`Unable to scan directory: ${err}`);
	}
	// console.log('allFilesName :>> ', allFilesName);
}

const inputDir = './input/filesToRenameWithStructure';
const outputDir = './output/filesToRenameWithStructure';

renameFiles(inputDir, outputDir);
