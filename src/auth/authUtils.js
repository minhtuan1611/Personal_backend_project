'use strict'
const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NOT_FOUND_Error } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const { keys } = require('lodash')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify:`, err)
      } else {
        console.log(`Decode verify:`, decode)
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {
    return error
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  /*

  1 - Check userId missing??
  2 - get accessToken 
  3 - Verify Token
  4 - Check user in db? 
  5 - check keyStore with this userID?
  6 - Ok all =>  return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')

  //2
  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new NOT_FOUND_Error('Not found keyStore')

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid accessToken')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId)
      throw new AuthFailureError(' Invalid Userid')

    req.keyStore = keyStore
    return next()
  } catch (error) {}
})

module.exports = {
  createTokenPair,
  authentication,
}
