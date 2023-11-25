'use strict'

const { apiKey } = require('../../auth/checkAuth')
const express = require('express')
const router = express.Router()

// check API
router.use(apiKey)
// Check permission

router.use('/v1/api', require('../access'))

module.exports = router
