// require the express library
const express = require('express')

// require the passporty library for Bearer authentication
const passport = require('passport')

// require our restaurant mongoose model, to interact with the database
const Restaurant = require('../models/restaurant')
const Review = require('../models/review')

// Import our customErrors
const customErrors = require('../../lib/custom_errors')

// pull out the handle404 error. This will be used if an restaurant doesnt exist
// when you try to show/update/delete it
const handle404 = customErrors.handle404

// will throw an error if the user isnt the user who created the resource
// they are trying to edit
const requireOwnership = customErrors.requireOwnership

// require a function that will remove any properties with
// values of an empty string ''
// const removeBlanks = require('../../lib/remove_blank_fields')

// get a function that requires that a request has an authorization header
// the logic comes from passport
const requireToken = passport.authenticate('bearer', { session: false })

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
    .then(foundrestaurant => {
      restaurant = foundrestaurant.toObject()

      // finding all patients that have the restaurant associated with 'id'
      return Review.find({ restaurant: id })
    })
    .then(reviews => {
      // adding patients to our restaurant object, so they will be serialized
      restaurant.reviews = reviews
      res.json({ restaurant })
    })
    .catch(next)
})

// DESTROY
router.delete('/restaurants/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then((restaurant) => { console.log(restaurant) })
    .then(handle404)
    .then(restaurant => {
      // The user must own a patient to delete it
      requireOwnership(req, restaurant)
      // remove will delete a patient from the database
      restaurant.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// CREATE
router.post('/restaurants', requireToken, (req, res, next) => {
  // sets the owner fo the restaurant to the currently signed in user
  req.body.restaurant.owner = req.user.id

  Restaurant.create(req.body.restaurant)
    .then(restaurant => {
      return restaurant.toObject()
    })
    .then(restaurant => {
      res.status(201).json({ restaurant })
    })
    .catch(next)
})

// UPDATE
// PATCH /restaurants/5a7db6c74d55bc51bdf39793
router.patch('/restaurant/:id', (req, res, next) => {
  delete req.body.restaurant.owner

  Restaurant.findById(req.params.id)
    .then(handle404)
    .then(restaurant => {
      requireOwnership(req, restaurant)

      return restaurant.update(req.body.restaurant)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
