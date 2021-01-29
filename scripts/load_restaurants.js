const mongoose = require('mongoose')
const fs = require('fs')
const dbAddress = require('../config/db')

const bcrypt = require('bcrypt')
const bcryptSaltRounds = 10

const User = require('../app/models/user.js')
const Restaurant = require('../app/models/restaurant.js')

mongoose.Promise = global.Promise
mongoose.connect(dbAddress, {
  // useMongoClient: true
})

const db = mongoose.connection

const done = () => db.close()

const parseRestaurants = () => {
  return new Promise((resolve, reject) => {
    const restaurants = []
    const parse = require('csv').parse
    const parser = parse({ columns: true })

    const input = fs.createReadStream('data/restaurants.csv')
    input.on('error', e => reject(e))

    parser.on('readable', () => {
      let record
      while (record = parser.read()) { // eslint-disable-line
        restaurants.push(record)
      }
    })

    parser.on('error', e => reject(e))
    parser.on('finish', () => resolve(restaurants))
    input.pipe(parser)
  })
}

if (process.argv[2] && process.argv[3]) {
  bcrypt.hash(process.argv[3], bcryptSaltRounds)
    .then((pword) => {
      return User.create({email: process.argv[2], hashedPassword: pword})
    })
    .then(user => Promise.all([ user, parseRestaurants() ]))
    .then(data => {
      let [user, restaurants] = data

      return Promise.all(restaurants.map(restaurant => {
        return Restaurant.create({
          name: restaurant.name,
          description: restaurant.description,
          general_location: restaurant.general_location,
          website: restaurant.website,
          owner: user._id
        })
      }))
    })
    .then(restaurants => {
      console.log(`Created ${restaurants.length} restaurants!`)
    })
    .catch(console.error)
    .then(done)
} else {
  console.log('Script requires email and password')
  done()
}
