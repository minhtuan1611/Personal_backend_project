const express = require('express')
const morgan = require('morgan')
const app = express()

//init middle wares
app.use(morgan('dev'))

//init DB

//init routes
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome!!',
  })
})
// handle errors

module.exports = app
