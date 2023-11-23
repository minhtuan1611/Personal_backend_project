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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//init DB
require('./db/init.mongodb')

//init routes
app.use('/', require('./routes'))
// handle errors

module.exports = app
