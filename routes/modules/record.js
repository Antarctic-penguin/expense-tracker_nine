const express = require('express')        // 引用 Express 與 Express 路由器
const router = express.Router()          // 準備引入路由模組
const record = require('../../models/records')
const categoryData = require('../../models/category')

// 新增資料的頁面
router.get('/new', (req, res) => {
  categoryData.find()
    .lean()
    .then(categoryData => {
      res.render('new', { categoryData })
    })
    .catch(error => console.error(error))
})

//使用者新增資料後處理路由
router.post('/', async(req, res) => {
  const userId = req.user._id
  const { name, date, amount, category } = req.body
  const categoryID=await categoryData.findOne({ name: category }).lean()
  const errors = []
  if (!name || !date || !amount || !category) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (errors.length) {
    return res.render('new', { errors,name,date, amount })
  }
  record.create({ name, userId, date, amount, category: categoryID._id })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 修改資料的頁面
router.get('/edit/:id', async(req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const categoryList=await categoryData.find().lean()
  record.findOne({ _id,userId})
    .populate('category')
    .lean()
    .then((record) => res.render('edit', { record, categoryList }))
    .catch(error => console.log(error))
})

// 使用者修改資料後的路由
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, amount, category } = req.body
  record.findOne({ _id,userId})
    .then(record => {
      Object.assign(record, { name, date, amount, category});
      return record.save()
    })
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})

// 搜尋功能
router.get('/search', (req, res) => {
  const userId = req.user._id
  const category = req.query.category
  if (category === 'all') {
    return res.redirect('/')
  }
  categoryData.find()
    .lean()
    .then(categoryList => {
      record.find({category,userId })
        .populate('category')
        .lean()
        .then(record => {
          console.log(categoryList)
          let totalAmount = 0
          record.forEach(element => {
            totalAmount = totalAmount + element.amount
          });
          res.render('search', { category, categoryList, record, totalAmount })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

// 使用者刪除資料的路由
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  record.findOne({ _id})
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router