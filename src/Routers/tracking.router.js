const express = require('express');
const { post, getAll } = require('../Controllers/tracking.controllers');
const upload = require('../Middleware/Upload');
const router = express.Router();


router.post('/tracking', upload.single("image"), post);
router.get('/tracking', getAll);

module.exports = router;