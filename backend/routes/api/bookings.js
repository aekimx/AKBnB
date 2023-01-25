const express = require('express');
const {
  Booking,
  Spot,
  Review,
  ReviewImage,
  SpotImage,
  User,
  sequelize
} = require("../../db/models");
const { requireAuth, restoreUser } = require("../../utils/auth");

const { check } = require('express-validator');
const { handleValidationErrorsSpots } = require('../../utils/validation');

const router = express.Router();

// GET all bookings

router.get('/current', restoreUser, requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    include: {model: Spot}
  })
  return res.json({"Bookings": bookings})
})





module.exports = router;
