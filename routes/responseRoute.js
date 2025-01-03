const express = require("express");
const { submitForm } = require("../controllers/responsesController");

const router = express.Router();

// submit form-bot by formId
router.post("/", submitForm);

module.exports = router;
