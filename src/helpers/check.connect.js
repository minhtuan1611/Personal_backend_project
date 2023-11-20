'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// count Connect
const countConnect = () => {
  const numConnecttion = mongoose.connections.length
  console.log(`Number of connections:: ${numConnecttion}`)
}

// check over load

const checkOverLoad = () => {
  setInterval(() => {
    const numConnecttion = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Example maximum number of connections based on nuumber of cors
    const maxConnections = numCores * 5

    console.log(`Actitve connections: ${numConnecttion}`)
    console.log(`Memory uasge: ${memoryUsage / 1024 / 1024} MB`)

    if (numConnecttion > maxConnections) {
      console.log(`Connection overload detected`)
    }
  }, _SECONDS) //Monitor every 5 seconds
}

module.exports = {
  countConnect,
  checkOverLoad,
}
