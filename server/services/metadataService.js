const fs = require("fs");
const ExifParser = require("exif-parser");

const extractMetadataRisk = (filePath) => {
    try {
        const buffer = fs.readFileSync(filePath);
        const parser = ExifParser.create(buffer);
        const result = parser.parse();

        let risk = 0;

        if (!result.tags) risk += 30;
        if (result.tags.Software) risk += 30; // Edited in software
        if (!result.tags.DateTimeOriginal) risk += 20;

        return risk;
    } catch (err) {
        return 40; // If metadata unreadable
    }
};

module.exports = { extractMetadataRisk };