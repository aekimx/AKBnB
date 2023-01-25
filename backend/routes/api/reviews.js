const express = require('express');
const {
  Spot,
  Review,
  ReviewImage,
  SpotImage,
  User
} = require("../../db/models");
const { requireAuth, restoreUser } = require("../../utils/auth");

const { check } = require('express-validator');
const { handleValidationErrorsSpots } = require('../../utils/validation');

const router = express.Router();

// GET /reviews/current
router.get('/current', restoreUser, requireAuth, async (req, res)=> {
  const reviews = await Review.findAll();
  return res.json(reviews);
})


module.exports = router;
