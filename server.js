const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const apiRouter = require('./api/api')

const app = express();
const PORT = process.env.PORT || 4000;


app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));



// For routes
app.use('/api', apiRouter)









app.listen(PORT, () => {
  console.log(`The server is listening on ${PORT}`);
})


module.exports = app;