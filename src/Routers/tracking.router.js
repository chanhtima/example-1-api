const express = require('express');
const { post, getAll, getById, softDelete, updateData } = require('../Controllers/tracking.controllers');
const upload = require('../Middleware/Upload');
const router = express.Router();


router.post('/tracking', upload.array("image"), post);
router.get('/tracking', getAll);
router.get('/tracking/:id', getById);
router.delete('/tracking/:id', softDelete);
router.put('/tracking/:id',upload.array("image"), updateData);


module.exports = router;