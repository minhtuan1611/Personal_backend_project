'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exist??

      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop has already resgistered',
        }
      }
      const passwordHash = await bcrypt.hash(password, 10)

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      })

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        console.log({ privateKey, publicKey })

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        })
        if (!keyStore) {
          return {
            code: 'xxxx',
            message: 'KeyStore error',
          }
        }

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        )
        console.log(`Created Token Success: `, tokens)
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fileds: ['_id', 'name', 'email'],
              object: newShop,
            }),
            tokens,
          },
        }
      }
      return {
        code: 200,
        metadata: null,
      }
    } catch (err) {
      return {
        code: 'xxxx',
        message: err.message,
        status: 'error',
      }
    }
  }
}

module.exports = AccessService
