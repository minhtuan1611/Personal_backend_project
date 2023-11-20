require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const app = express()
const compression = require('compression')

//init middle wares
app.use(helmet())
app.use(morgan('dev'))
app.use(compression())

//init DB
require('./db/init.mongodb')
const { checkOverLoad } = require('./helpers/check.connect')
checkOverLoad()

//init routes
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome!!',
  })
})
// handle errors

module.exports = app
