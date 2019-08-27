// require the express library
const express = require('express')

// require the passporty library for Bearer authentication
const passport = require('passport')

// require our Example mongoose model, to interact with the database
const Review = require('../models/review')

// Import our customErrors
const customErrors = require('../../lib/custom_errors')

// pull out the handle404 error. This will be used if an example doesnt exist
// when you try to show/update/delete it
const handle404 = customErrors.handle404

// will throw an error if the user isnt the user who created the resource
// they are trying to edit
const requireOwnership = customErrors.requireOwnership

// require a function that will remove any properties with
// values of an empty string ''
const removeBlanks = require('../../lib/remove_blank_fields')

// get a function that requires that a request has an authorization header
// the logic comes from passport
const requireToken = passport.authenticate('bearer', { session: false })

// create a Router for this specific file
// we will add our routes to this router
// then add the router to the 'app' in 'server.js'
const router = express.Router()

// ROUTES
// INDEX
router.get('/reviews', (req, res, next) => {
  Review.find()
    .populate('restaurant')
    .then(reviews => {
      return reviews.map(review => review.toObject())
    })
    .then(reviews => {
      res.json({ reviews })
    })
    .then((reviews) => { console.log(reviews) })
    .catch(next)
})

// SHOW

router.get('/reviews/:id', (req, res, next) => {
  const id = req.params.id
  Review.findById(id)
    .populate('restaurant')
    .then(handle404)
    .then(review => {
      return review.toObject()
    })
    .then(review => {
      res.json({ review })
    })
    .catch(next)
})

// DESTROY
router.delete('/reviews/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Review.findById(id)
    .then(handle404)
    .then(review => {
      // The user must own a review to delete it
      requireOwnership(req, review)
      // remove will delete a review from the database
      review.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// CREATE
router.post('/reviews', requireToken, (req, res, next) => {
  // Make sure review is owned by current user
  req.body.review.owner = req.user.id

  Review.create(req.body.review)
    .then(review => {
      return review.toObject()
    })
    .then(review => {
      // send the review back to the client with a 201 created
      res.status(201).json({ review })
    })
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/reviews/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.review.owner
  console.log(req.params.id)

  Review.findById(req.params.id)
    .then(handle404)
    .then(review => {
      console.log(review)
      requireOwnership(req, review)
      console.log(req.body.review)
      return review.update(req.body.review)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
