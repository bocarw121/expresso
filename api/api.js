const express = require('express');
const apiRouter = express.Router();

apiRouter.use('/employees', require('./employees'));

module.exports = apiRouter;