const axios = require("axios");

const detectAIText = async (text) => {
    try {
        const response = await axios.post("https://api.huggingface.co/models/roberta-base-openai-detector", {
            inputs: text
        }, {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            }
        });

        const score = response.data[0]?.score * 100;
        return score || 50;
    } catch (err) {
        return 50;
    }
};

module.exports = { detectAIText };