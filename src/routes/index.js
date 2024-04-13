const express = require('express');
const router = express.Router();
const roomRoutes = require('./room');

router.use('/room', roomRoutes);


module.exports = router;