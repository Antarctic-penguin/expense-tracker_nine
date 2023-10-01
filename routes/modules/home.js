const express = require('express')
const router = express.Router()
const record = require('../../models/records')
const categoryList = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  categoryList.find()
    .lean()
    .then(categoryData => {
      record.find({userId})
        .populate('category')
        .lean()
        .then(record => {
          let totalAmount = 0
          record.forEach(element => {
            totalAmount = totalAmount + element.amount
          });
          res.render('index', { categoryData, record, totalAmount })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})
// 匯出路由模組
module.exports = router