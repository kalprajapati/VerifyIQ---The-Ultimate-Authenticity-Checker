const calculateTrustScore = (deepfakeData, verificationData, metadataRisk = 0) => {
    // Weights
    const W_DEEPFAKE = 0.4;
    const W_VERIFY = 0.4;
    const W_META = 0.2;

    // Normalizing inputs
    // Deepwire returns "Deepfake Score" (Higher = Fake). We want Trust Score (Higher = Real).
    // So Trust Deepfake Component = 100 - Deepfake Score.
    const deepfakeTrust = 100 - (deepfakeData.score || 0);

    // Verification Score (Higher = Real/True).
    const verifyTrust = verificationData?.score || 50; // Default neutral

    // Metadata Risk (Higher = Risky). Trust = 100 - Risk.
    const metaTrust = 100 - metadataRisk;

    // Final Calculation
    const totalScore = (deepfakeTrust * W_DEEPFAKE) + (verifyTrust * W_VERIFY) + (metaTrust * W_META);

    return Math.round(totalScore);
};

module.exports = { calculateTrustScore };
