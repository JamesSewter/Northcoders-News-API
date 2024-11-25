const express = require("express");
const { getApi } = require("./controllers/api.controller");
const app = express();



app.get('/api', getApi);

module.exports = app