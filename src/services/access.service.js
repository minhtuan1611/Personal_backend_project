'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')

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
        // created privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
        })

        console.log({ privateKey, publicKey }, 'hiii')

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop_id,
          publicKey,
        })
        if (!publicKeyString) {
          return {
            code: 'xxxx',
            message: 'PublicKeyString error',
          }
        }
        const tokens = await createTokenPair(
          { userId: newShop_id, email },
          publicKey,
          privateKey
        )
        console.log(`Created Token Success: `, tokens)
        return {
          code: 201,
          metadata: {
            shop: newShop,
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
