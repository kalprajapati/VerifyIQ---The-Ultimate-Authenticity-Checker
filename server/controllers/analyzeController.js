const Report = require('../models/Report');
const { scanMedia } = require('../services/deepfakeService');
const { verifyText } = require('../services/factCheckService');
const { calculateTrustScore } = require('../utils/trustScore');
const { extractMetadataRisk } = require('../services/metadataService');
const { detectAIText } = require('../services/aiTextService');

// @desc    Analyze uploaded media (Image/Video)
// @route   POST /api/analyze/media
// @access  Public
const analyzeMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // 1. Mock Metadata Extraction (Simulating ffmpeg/exiftool)
        const metadataRisk = extractMetadataRisk(req.file.path); // Random low risk for now

        // 2. Deepware Scan
        // In a real app, we would upload the file to Deepware or a cloud bucket first.
        // Here we just pass the dummy identifier.
        const deepwareResult = await scanMedia(req.file.path);

        // 3. Calculate Score
        // Media usually doesn't have text verification unless transcribed. 
        // We'll treat "verification" as neutral (50) or N/A
        const trustScore = calculateTrustScore(
            { score: deepwareResult.score },
            { score: 50 },
            metadataRisk
        );

        // 4. Save Report
        const report = new Report({
            type: 'media',
            input: req.file.filename,
            deepwareScore: deepwareResult.score,
            deepfakeProbability: deepwareResult.confidence * 100,
            metadataScore: 100 - metadataRisk,
            trustScore: trustScore,
            details: deepwareResult
        });

        // 4. Save Report (Optional)
        try {
            await report.save();
        } catch (dbError) {
            console.error("Database save failed (ignoring):", dbError.message);
        }

        res.status(200).json({ success: true, report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// @desc    Analyze text or URL
// @route   POST /api/analyze/text
// @access  Public
const analyzeText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ msg: 'No text provided' });
        }

        // 1. Verify Text
        const verifyResult = await verifyText(text);

        // 2. Deepfake check for text (usually AI detection models like GPTZero)
        // We will mock this component for now as "Text AI Detection"
        const aiDetectionScore = await detectAIText(text);
        const isAiGenerated = aiDetectionScore > 50;

        // 3. Calculate Score
        // We map AI detection to "Deepfake Data" slot
        const trustScore = calculateTrustScore(
            { score: aiDetectionScore },
            verifyResult,
            0 // No metadata risk for raw text
        );

        // 4. Save Report
        const report = new Report({
            type: 'text',
            input: text.substring(0, 50) + '...',
            deepwareScore: aiDetectionScore, // Reusing field for AI score
            factCheckScore: verifyResult.score,
            trustScore: trustScore,
            details: { ...verifyResult, isAiGenerated }
        });

        // 4. Save Report (Optional)
        try {
            await report.save();
        } catch (dbError) {
            console.error("Database save failed (ignoring):", dbError.message);
        }

        res.status(200).json({ success: true, report });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// @desc    Get Report by ID
// @route   GET /api/report/:id
const getReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ msg: 'Report not found' });
        res.json(report);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

module.exports = { analyzeMedia, analyzeText, getReport };
