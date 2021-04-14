const app = require('express').Router()
const api = require('./api')

app.use(api)

module.exports = app