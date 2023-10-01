const Record = require('../records')
const db = require('../../config/mongoose')
const User = require("../users")
const seedRecord = require('./record.json')
const category = require("../category")
const bcrypt = require('bcryptjs')

const seedUser = {
  name: '廣志',
  email: 'user1@example.com',
  password: '123'

}

//新增資料
db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(seedUser.password, salt))
    .then(hash => User.create({
      name: seedUser.name,
      email: seedUser.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id;
      return Promise.all(
        Array.from({ length: seedRecord.length }, (_, i) => {
          const categoryName = seedRecord[i].category;
          return category.findOne({ name: categoryName }).then((category) =>
            Record.create({
              name: seedRecord[i].name,
              category: category._id,
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