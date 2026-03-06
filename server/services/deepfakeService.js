const { exec } = require("child_process");
const path = require("path");

const scanMedia = (filePath) => {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, "../ai/detect.py");

        // 👇 This is the important line
        const pythonPath = path.join(__dirname, "../venv/Scripts/python.exe");

        exec(`"${pythonPath}" "${pythonScript}" "${filePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error("Python Error:", error);
                return reject(error);
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = { scanMedia };