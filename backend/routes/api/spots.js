const express = require("express");
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

const { check } = require("express-validator");
const { handleValidationErrorsSpots, handleValidationErrorsBookings } = require("../../utils/validation");

const router = express.Router();

// GET /spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    raw: true
  });
  if (!spots) {
    return res.json({"message": "No spots found"})
  } else {
    for (let spot of spots) {
      let review = await Review.findAll({
        raw: true,
        attributes: [
          [sequelize.fn("avg", sequelize.col("stars")), "avgStarRating"]
        ],
        where: { spotId: spot.id }
      });
      spot.avgRating = review[0].avgStarRating;

      let previewImageURL = await SpotImage.findAll({
        raw: true,
        attributes: ["url"],
        where: {
          spotId: spot.id,
          preview: true
        }
      });
      if (previewImageURL[0]) {
        spot.previewImage = previewImageURL[0].url;
      } else {
        spot.previewImage = null;
      }
    }
    return res.json({ Spots: spots });
  }
});

// GET /api/spots/current
router.get("/current", restoreUser, requireAuth, async (req, res) => {
  // console.log(req.user.id);
  let userSpots = await Spot.findAll({
    raw: true,
    where: {
      ownerId: req.user.id
    }
  });
  // add avg rating - refactor later
  for (let spot of userSpots) {
    let review = await Review.findAll({
      raw: true,
      attributes: [
        [sequelize.fn("avg", sequelize.col("stars")), "avgStarRating"]
      ],
      where: {
        userId: req.user.id
      }
    });
    spot.avgRating = review[0].avgStarRating;

    // add preview image
    let previewImageURL = await SpotImage.findAll({
      raw: true,
      attributes: ["url"],
      where: {
        spotId: spot.id,
        preview: true
      }
    });
    spot.previewImage = previewImageURL[0].url;
  }
  return res.json({ Spots: userSpots });
});

// GET /api/spots/:spotId
router.get("/:spotId", async (req, res) => {
  let id = req.params.spotId;
  let spot = await Spot.findOne({
    include: [
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"]
      },
    ],
    where: {id: id}
  });
  if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  } else {
    let spotImages = await SpotImage.findAll({
      attributes: ["id", "url", "preview"],
      where: {spotId: req.params.spotId}
    });
    spot = spot.toJSON();
    spot.spotImages = spotImages;

    let reviews = await Review.findAll({
      raw: true,
      attributes: [
        [sequelize.fn("avg", sequelize.col("stars")), "avgStarRating"],
        [sequelize.fn("count", sequelize.col("review")), "numReviews"]
      ],
      where: {spotId: id}
    })
    spot.avgStarRating = reviews[0].avgStarRating;
    spot.numReviews= reviews[0].numReviews;

    return res.json(spot);
  }
});

const validateCreateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid")
    .isDecimal()
    .withMessage("Latitude should be a decimal"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid")
    .isDecimal()
    .withMessage("Longitude should be a decimal"),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name should be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrorsSpots
];

// POST /api/spots

router.post("/", requireAuth, validateCreateSpot, async (req, res) => {
  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  } = req.body;

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });
  res.status(201);
  return res.json(newSpot);
});

// POST /api/spots/:spotId/images
router.post("/:spotId/images", restoreUser, requireAuth, async (req, res) => {
  let spot = await Spot.findAll({
    raw: true,
    where: {id: req.params.spotId}
  });
  console.log(spot);
  if (!spot) {
    let error = {
      message: "Spot couldn't be found",
      statusCode: 404
    };
    return res.json(error);
  } else {
    if (spot[0].ownerId === req.user.id) {
      const { url, preview } = req.body;
      const spotId = req.params.spotId;
      let newSpotImage = await SpotImage.scope(['defaultScope']).create({ spotId, url, preview });
      res.status(200);
      return res.json({
        "id":newSpotImage.id,
        "url":newSpotImage.url,
        "preview": newSpotImage.preview}
      );
    }
  }
});

//PUT /api/spots/:spotId
router.put("/:spotId", restoreUser, requireAuth, validateCreateSpot, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      let error = {
        message: "Spot couldn't be found",
        statusCode: 404
      };
      return res.json(error);
    } else {
      if (spot.ownerId === req.user.id) {
        const {
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price
        } = req.body;
        if (address) spot.address = address;
        if (city) spot.city = city;
        if (state) spot.state = state;
        if (country) spot.country = country;
        if (lat) spot.lat = lat;
        if (lng) spot.lng = lng;
        if (name) spot.name = name;
        if (description) spot.description = description;
        if (price) spot.price = price;
      }
      res.status(200);
      let updatedSpot = await Spot.findByPk(req.params.spotId);
      return res.json(updatedSpot);
    }
  }
);

// DELETE /api/spots/:spotId

router.delete("/:spotId", async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    let error = {
      message: "Spot couldn't be found",
      statusCode: 404
    };
    return res.json(error);
  } else {
    await spot.destroy();
    return res.json({
      message: "Successfully deleted",
      statusCode: 200
    });
  }
});

// GET /api/spots/:spotId/reviews
router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  } else {
    const reviews = await Review.findAll({
      where: {
        spotId: req.params.spotId
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"]
        },
        { model: ReviewImage,
        attributes: ['id','url'] }
      ]
    });
    return res.json({ Reviews: reviews });
  }
});

const validateCreateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .withMessage("You must provide star rating")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrorsSpots
];

// POST /api/spots/:spotId/reviews
router.post("/:spotId/reviews", requireAuth, validateCreateReview, async (req, res) => {
  const spot = await Spot.findOne({
      where: {
        id: req.params.spotId
      },
      raw: true
    });
    if (!spot) {
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      });
    } else if (Review.findOne({ where: { userId: spot.ownerId } })) {
      res.status(403);
      return res.json({
        message: "User already has a review for this spot",
        statusCode: 403
      });
    } else {
      const { review, stars } = req.body;
      let newReview = await Review.create({
        userId: spot.ownerId,
        spotId: req.params.spotId,
        review,
        stars
      });
      res.status(201);
      return res.json(newReview);
  }
});

// GET /api/spots/:spotId/bookings
router.get('/:spotId/bookings', requireAuth, async (req,res) => {
  let spot = await Spot.findByPk(req.params.spotId);
  spot = spot.toJSON();
  if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
  if (spot.ownerId === req.user.id) {
    let bookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
    });
    if (!bookings) {
      res.status(404);
      return res.json({"Message": "No bookings found!"})
    } else {
      for (let i = 0; i < bookings.length; i++) {
        let booking = bookings[i].toJSON();
        let start = booking.startDate.toISOString().slice(0,10);
        let end = booking.endDate.toISOString().slice(0,10);
        bookings[i].dataValues.startDate = start;
        bookings[i].dataValues.endDate = end;
      }
      return res.json({"Bookings": bookings})
    }
  } else {
    const bookingsLite = await Booking.findAll({
      where: {
        spotId: req.params.spotId
      },
      attributes: {exclude: ['id','userId','createdAt', 'updatedAt']}
    });
    if (!bookingsLite) {
      res.status(404)
      return res.json({"message": "No bookings found!"});
    } else {
      for (let i = 0; i < bookingsLite.length; i++) {
        let booking = bookingsLite[i].toJSON();
        let start = booking.startDate.toISOString().slice(0,10);
        let end = booking.endDate.toISOString().slice(0,10);
        bookingsLite[i].dataValues.startDate = start
        bookingsLite[i].dataValues.endDate = end
      }
      return res.json({"Bookings": bookingsLite})
    }
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

// POST /api/spots/:spotId/bookings
router.post('/:spotId/bookings', requireAuth, validateCreateBooking, async (req,res) => {
  let spot = await Spot.findOne({
    where: {id: req.params.spotId},
    raw: true
  });
  if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  } else {
    if (!(spot.userId === req.user.id)) {
      let {startDate, endDate} = req.body;
      startDate = new Date(startDate).getTime();
      endDate = new Date(endDate).getTime();
      if (endDate <= startDate) {
        res.status(400);
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {"endDate": "endDate cannot be on or before startDate"}
          })
      } else {
        let bookings = await Booking.findAll({
          raw: true,
          where: {spotId: req.params.spotId}})
        for (let booking of bookings) {
          let bookingStart = new Date(booking.startDate).getTime();
          let bookingEnd = new Date(booking.endDate).getTime();
          if ((bookingStart === startDate) && (bookingEnd === endDate)) {
              return res.json({
                // "another": "ONE",
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                  "startDate": "Start date conflicts with an existing booking",
                  "endDate": "End date conflicts with an existing booking"}})
          } else if ((startDate >= bookingStart) && (startDate < bookingEnd) &&
            (endDate > bookingStart) && (endDate <= bookingEnd)) {
              return res.json({
                // "another": "TWO",
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                   "startDate": "Start date conflicts with an existing booking",
                   "endDate": "End date conflicts with an existing booking"}})
          } else if ((startDate >= bookingStart) && (startDate <= bookingEnd)) {
              return res.json({
                // "another": "THREE",
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                  "startDate": "Start date conflicts with an existing booking"}})
          } else if ((endDate >= bookingStart) && (endDate <= bookingEnd)) {
              return res.json({
                // "another": "FOUR",
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                  "endDate": "End date conflicts with an existing booking"}})
          } else if ((startDate < bookingStart) && (endDate > bookingEnd)) {
            return res.json({
              // "another": "FIVE",
              "message": "Sorry, this spot is already booked for the specified dates",
              "statusCode": 403,
              "errors": {
                 "startDate": "Start date conflicts with an existing booking",
                 "endDate": "End date conflicts with an existing booking"}})
          } else {
              let newBooking = await Booking.create({
                spotId: req.params.spotId,
                userId: req.user.id,
                startDate,
                endDate});
                res.status(200);
                newBooking = newBooking.toJSON();
                let start = newBooking.startDate.toISOString().slice(0,10);
                let end = newBooking.endDate.toISOString().slice(0,10);
                newBooking.startDate = start;
                newBooking.endDate = end;
                return res.json(newBooking);
            }
            }
          }
      } else {
        return res.json("You cannot book your own spot!")
      }
  }
})



module.exports = router;
