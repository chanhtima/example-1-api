const express = require('express');
const { post } = require('../Controllers/menu_service.controllers');
const router = express.Router();
const upload = require('../Middleware/Upload');


router.post('/menuService',upload.single("image"), post);

module.exports = router;