const missingTranslations = require('../output/missingTranslations')
const fs = require('fs');
const util = require('util');
const path = require('path');

const generatedTranslations = {};

const getTranslation = (key) => {
    const translation = key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    return {
        en: translation,
        ar: translation,
    }
}

missingTranslations.forEach((key) => {
    generatedTranslations[key] = getTranslation(key)
})

const outputDir = path.join(__dirname, '../output');
const outputFilePath = path.join(outputDir, 'generatedTranslations.js');

fs.writeFileSync(
    outputFilePath,
    `// File Record Time: ${new Date()} \n\nconst generatedTranslations = ` + util.inspect(generatedTranslations, { showHidden: false, depth: null, maxArrayLength: null })
);