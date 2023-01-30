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
const { handleValidationErrorsBookings } = require('../../utils/validation');

const router = express.Router();

// GET /api/bookings/current

router.get('/current', restoreUser, requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    include: {
      model: Spot,
      attributes: {exclude: ['createdAt', 'updatedAt', 'description']}
    }
  })
  if (!bookings[0]) {
    return res.json("No bookings found!")
  } else {
    for (let i = 0; i<bookings.length; i++ ) {
      let booking = bookings[i];
      let image = await SpotImage.findOne({
        where: {
          spotId: booking.spotId,
          preview: true
        },
        attributes: ['url']
      });
      if (!image) {
        booking.dataValues.Spot.dataValues.previewImage = null;
      } else {
        booking.dataValues.Spot.dataValues.previewImage = image.url
      }

      let start = booking.startDate.toISOString().slice(0,10);
      let end = booking.endDate.toISOString().slice(0,10);
      booking.dataValues.startDate = start;
      booking.dataValues.endDate = end;
  }
  return res.json({"Bookings": bookings});
  }

})


const validateCreateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("Start Date is required"),
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("End date is required"),
    handleValidationErrorsBookings
];


// PUT /api/bookings/:bookingId

router.put('/:bookingId', requireAuth, validateCreateBooking, async (req, res) => {
  let currentBooking = await Booking.findOne({
    raw: true,
    where: {id: req.params.bookingId}
  });

  if (!currentBooking) {
    res.status(404);
    return res.json({
      "message": "Booking couldn't be found",
      "statusCode": 404})
    } else {
      let currentEnd = new Date(currentBooking.endDate).getTime();
      let currentStart = new Date(currentBooking.startDate).getTime();
      // what we are trying to edit the booking dates to
      let {startDate, endDate} = req.body;
      newStart = new Date(startDate).getTime();
      newEnd = new Date(endDate).getTime();
    // Require authorization: must be user's own booking
    if (currentBooking.userId === req.user.id) {
      // find all bookings for the current spot
      let today = new Date().getTime();
      let allBookings = await Booking.findAll({
        raw: true,
        where: {spotId: currentBooking.spotId}
      })
      // Trying to switch end date before start
      if (newEnd < newStart) {
        res.status(400);
        return res.json({
          "message": "Validation error",
          "statusCode": 400,
          "errors": {
            "endDate": "endDate cannot come before startDate"
          }
        })
        // cannot check in and check out on same day
      } else if (newEnd === newStart){
        res.status(400);
        return res.json({
          "message": "Validation error",
          "statusCode": 400,
          "errors": {
            "endDate": "endDate cannot be the same as startDate"
          }
        })
      } else if (currentEnd < today) {
        res.status(403);
        return res.json({
          "message": "Past bookings can't be modified",
          "statusCode": 403
        })
      } else {
        // iterate through bookings
        for (let i = 0; i < allBookings.length; i++) {
          let booking = allBookings[i];
          let start = new Date(booking.startDate).getTime();
          let end = new Date(booking.endDate).getTime();
          // try to switch for same date
          if ((newStart === start) && (newEnd === end)) {
            res.status(403);
            return res.json({
              // "another": "ONE",
              "message": "Sorry, this spot is already booked for the specified dates",
              "statusCode": 403,
              "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
              }})
              // if new booking is within current booking
          } else if ((newStart < newEnd) && (newStart >= start) && (newEnd <= end)) {
            res.status(403);
            return res.json({
              // "another": "TWO",
              "message": "Sorry, this spot is already booked for the specified dates",
              "statusCode": 403,
              "errors": {
                 "startDate": "Start date conflicts with an existing booking",
                 "endDate": "End date conflicts with an existing booking"}})
                 // if end is good but new start is within current booking
          } else if ((newStart >= start) && (newStart <= end)) {
            res.status(403);
            return res.json({
              // "another": "THREE",
              "message": "Sorry, this spot is already booked for the specified dates",
              "statusCode": 403,
              "errors": {
                "startDate": "Start date conflicts with an existing booking"}})
                // if start is good but new end is within current booking
          } else if ((newEnd >= start) && (newEnd <= end)) {
            res.status(403);
            return res.json({
              // "another": "FOUR",
              "message": "Sorry, this spot is already booked for the specified dates",
              "statusCode": 403,
              "errors": {
                "endDate": "End date conflicts with an existing booking"}})
                // if new start and new end envelope booking
          } else if ((newStart < start) && (newEnd > end)) {
            res.status(403);
            return res.json({
              // "another": "FIVE",
              "message": "Sorry, this spot is already booked for the specified dates",
              "statusCode": 403,
              "errors": {
                 "startDate": "Start date conflicts with an existing booking",
                 "endDate": "End date conflicts with an existing booking"}})
          }
        } // if it checks all bookings and exits for loop, reassign the values
            currentBooking.startDate = startDate;
            currentBooking.endDate = endDate;
            return res.json(currentBooking);
      }
    } else {
      res.status(403);
      return res.json("You are not authorized to update this booking.")
    }
  }
})

// DELETE /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async(req,res) => {
  let booking = await Booking.findOne({
    // raw: true,
    where: {id: req.params.bookingId}
  });
  if (!booking) {
    res.status(404);
    return res.json({
      "message": "Booking couldn't be found",
      "statusCode": 404
    })
  } else {
    let bookingStart = new Date(booking.startDate).getTime();
    let bookingEnd = new Date(booking.endDate).getTime();
    if (booking.userId === req.user.id) {
      // Cant delete a booking thats already started
      let today = new Date().getTime();
      if ((bookingStart <= today) && (bookingEnd >= today)) {
        res.status(403);
        return res.json({
          "message": "Bookings that have been started can't be deleted",
          "statusCode": 403
        })
      } else {
        await booking.destroy();
        return res.json({
          "message": "Successfully deleted",
          "statusCode": 200
        })
      }
    } else {
      res.status(403);
      return res.json("You are not authorized to delete this booking")
    }
  }
})


module.exports = router;
