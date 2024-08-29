const express = require('express');
const { post, getAll, getById } = require('../Controllers/menu_service.controllers');
const router = express.Router();
const upload = require('../Middleware/Upload');


router.post('/menuService',upload.single("image"), post);
router.get('/menuService' , getAll);
router.get('/menuService/:id' , getById);

module.exports = router;