import { promises as fs } from 'fs';
import path from 'path';
import { toCode, getCurrentDir } from './utils';

const conditionToRenameDir = (file: string): boolean => {
  // const dirsToRename = ['Dark', 'Light'];
  // return dirsToRename.includes(file)
  // return file.includes("_")
  return !!file
}

const renameFunction = (file: string): string => {
  return toCode(file)
}

async function renameDirs(dir: string) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      try {
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
          if (conditionToRenameDir(file)) {
            const newDirName = renameFunction(file);
            const newDirPath = path.join(dir, newDirName);

            await fs.rename(filePath, newDirPath);
            console.log(`Renamed Directory: ${filePath} -> ${newDirPath}`);

            // Recur into the renamed directory
            await renameDirs(newDirPath);
          } else {
            // Recur into the subdirectory without renaming
            await renameDirs(filePath);
          }
        }
      } catch (err) {
        console.error(`Error processing path ${filePath}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`Unable to scan directory: ${err.message}`);
  }
}

// Start the renaming process from the specified directory
renameDirs('./input/dirsToRename');