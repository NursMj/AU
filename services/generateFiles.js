import fs from 'fs';
import path from 'path';
import { getCurrentDir } from './utils';

const __dirname = getCurrentDir(import.meta);

const outputDir = path.join(__dirname, '../output/assets');

// Ensure the directory exists
fs.mkdirSync(outputDir, { recursive: true });

const locations = [
    'surf_abu_dhabi',
    'velodrome_abu_dhabi',
    '321_sports',
    'marsana',
    'trail_x',
    'circuit_x',
    'bab_al_nojoum_hudayriyat',
    'bab_al_nojoum_bateen_liwa',
    'bab_al_nojoum_al_mugheirah',
    'al_mugheirah_bay',
    'mamsha_al_mugheirah',
    'excel_london',
    'adnec_group'
];

locations.forEach(filename => {
    const filePath = path.join(outputDir, `${filename}.svg`);
    fs.writeFileSync(filePath, `<svg xmlns="http://www.w3.org/2000/svg"></svg>`);
    console.log(`Created: ${filePath}`);
});

console.log('SVG files generated successfully.');