const express = require('express')        // 引用 Express 與 Express 路由器
const router = express.Router()          // 準備引入路由模組
const User = require('../../models/users')   // 引用 user model

// 登錄頁路由
router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router
