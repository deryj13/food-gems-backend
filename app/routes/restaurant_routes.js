// require the express library
const express = require('express')



// require our Example mongoose model, to interact with the database
const Restaurant = require('../models/restaurant')
const Review = require('../models/review')

// Import our customErrors
const customErrors = require('../../lib/custom_errors')

// pull out the handle404 error. This will be used if an example doesnt exist
// when you try to show/update/delete it
const handle404 = customErrors.handle404

// require a function that will remove any properties with
// values of an empty string ''
const removeBlanks = require('../../lib/remove_blank_fields')

// create a Router for this specific file
// we will add our routes to this router
// then add the router to the 'app' in 'server.js'
const router = express.Router()

// INDEX
router.get('/restaurants', (req, res, next) => {
  Restaurant.find()
    .then(restaurants => {
      return restaurants.map(restaurant => restaurant.toObject())
    })
    .then(restaurants => {
      res.json({ restaurants })
    })
    .catch(next)
})

// SHOW

router.get('/restaurants/:id', (req, res, next) => {
  const id = req.params.id
  let restaurant
  Restaurant.findById(id)
    .then(handle404)
    .then(foundRestaurant => {
      restaurant = foundRestaurant.toObject()

      return Review.find({ restaurant: id })
    })
    .then(reviews => {
      restaurant.reviews = reviews
      res.json({ restaurant })
    })
    .catch(next)
})

// DESTROY
router.delete('/restaurants/:id', (req, res, next) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(handle404)
    .then(restaurant => {
      restaurant.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// CREATE
router.post('/restaurants', (req, res, next) => {
  console.log(req.body)

  Restaurant.create(req.body.restaurant)
    .then(restaurant => {
      return restaurant.toObject()
    })
    .then(restaurant => {
      res.status(201).json({ restaurant })
    })
    .catch(next)
})

module.exports = router
