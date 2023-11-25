'use strict'

const apikeyModel = require('../models/apikey.model')
const cryto = require('crypto')
const findById = async (key) => {
  // const newKey = await apikeyModel.create({
  //   key: cryto.randomBytes(64).toString('hex'),
  //   permissions: ['0000'],
  // })
  // console.log(newKey)
  const objKey = await apikeyModel.findOne({ key, status: true }).lean()
  return objKey
}

module.exports = {
  findById,
}
