const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// GET /signup 注册页
router.get('/', checkLogin, function(req, res, next) {
  res.send('注册页')
})

// POST /signup 用户注册
router.post('/', checkLogin, function(req, res, next) {
  res.send('注册')
})

module.exports = router