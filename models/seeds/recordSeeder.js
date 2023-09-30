const Record = require('../records')
const db = require('../../config/mongoose')
const User = require("../users")
const seedRecord = require('./record.json')
const category = require("../category")

const seedUser = {
  name: '廣志',
  email: 'user1@example.com',
  password: '123'

}

//新增資料
db.once('open', async () => {
  User.create({
      name: seedUser.name,
      email: seedUser.email,
      password: seedUser.password,
    })
    .then(user => {
      const userId = user._id;
      return Promise.all(
        Array.from({ length: seedRecord.length }, (_, i) => {
          const categoryName = seedRecord[i].category;
          return category.findOne({ name: categoryName }).then((category) =>
            Record.create({
              name: seedRecord[i].name,
              category: category._id, // 使用 category._id 來建立關聯
              date: seedRecord[i].date,
              amount: seedRecord[i].amount,
              userId,
            })
          );
        })
      );
    })
    .then(() => {
      console.log('Record seeder is done!')
      process.exit()
    })
    .catch((err) => console.error(err))
})