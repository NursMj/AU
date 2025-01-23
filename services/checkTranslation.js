const translation = require('../input/translation');
const translationConsumer = require('../input/translationConsumer');
const fs = require('fs');
const util = require('util');
const path = require('path');


const translationKeys = Object.keys(translation)
const missingTranslations =[]

Object.entries(translationConsumer).forEach(([_, array]) => {
    array.forEach(item => {
        if (!translationKeys.includes(item.location) && !missingTranslations.includes(item.location)) missingTranslations.push(item.location)
    })
})

console.log('missingTranslations :>> ', missingTranslations);

const outputDir = path.join(__dirname, '../output');
const outputFilePath = path.join(outputDir, 'missingTranslations.js');

fs.writeFileSync(
    outputFilePath,
    `// File Record Time: ${new Date()} \n\nmodule.exports = ` + util.inspect(missingTranslations, { showHidden: false, depth: null, maxArrayLength: null })
);