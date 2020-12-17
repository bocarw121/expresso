const express = require('express');
const apiRouter = express.Router();

apiRouter.use('/employees', require('./employees'));
apiRouter.use('/menus', require('./menus'));

module.exports = apiRouter;