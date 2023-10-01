const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
const helper = require("./handlebarsHelper")

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: helper }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(flash())

usePassport(app)
app.use((req, res, next) => {
  // 把 req.isAuthenticated() 回傳的布林值，交接給 res 使用
  res.locals.isAuthenticated = req.isAuthenticated()
  // 把使用者資料交接給 res 使用
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') 
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})


app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
