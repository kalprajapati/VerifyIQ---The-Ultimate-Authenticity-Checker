const express = require("express");
const { upload } = require("../middlewares/uploadMiddleware");
const { analyzeMedia } = require("../controllers/analyzeController");

const router = express.Router();

router.post("/", upload.single("file"), analyzeMedia);

module.exports = router;