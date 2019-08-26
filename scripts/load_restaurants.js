const mongoose = require('mongoose')
const fs = require('fs')
const dbAddress = require('../config/db')

const Restaurant = require('../app/models/restaruant.js')

mongoose.Promise = global.Promise
mongoose.connect(dbAddress, {
  useMongoClient: true
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

parseRestaurants()
  .then(data => {
    let [restaurants] = data

    return Promise.all(restaurants.map(restaurant => {
      return Restaurant.create({
        name: restaurant.name,
        description: restaurant.description,
        general_location: restaurant.general_location,
        website: restaurant.website,
        reviews: restaurant.reviews
      })
    }))
  })
  .then(restaurants => {
    console.log(`Created ${restaurants.length} restaurants!`)
  })
  .catch(console.error)
  .then(done)
