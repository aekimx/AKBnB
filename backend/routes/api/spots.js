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
router.get("/" , async (req, res) => {

  // pagination object and validation
  let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
  let size = req.query.size === undefined ? 20 : parseInt(req.query.size);

  if (page < 1 || page > 10 || isNaN(page)) {
    res.status(400)
    return res.json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {"page": "Page must be greater than or equal to 1",}})
  }
  if (size < 1 || size > 20 || isNaN(size)) {
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {"size": "Size must be greater than or equal to 1"}})
  }

  let pagination = {};
  pagination.limit = size;
  pagination.offset = (size * (page-1));

  // query filter validations
  let {minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
  if (minLat && isNaN(minLat)) {
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {"minLat": "Minimum latitude is invalid"}})
  }
  if (maxLat && isNaN(maxLat)) {
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {"maxLat": "Maximum latitude is invalid"}})
  }
  if (minLng && isNaN(minLng)) {
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {"minLng": "Maximum longitude is invalid"}})
  }
  if (maxLng && isNaN(maxLng)) {
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {"maxLng": "Minimum longitude is invalid"}})
  }
  if (minPrice && isNaN(minPrice)) {
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {"minPrice": "Maximum price must be greater than or equal to 0"}})
  }
  if (maxPrice && isNaN(maxPrice)) {
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {"maxPrice": "Minimum price must be greater than or equal to 0"}})
  }

  const spots = await Spot.findAll({...pagination});
  let spotsArray = [];

  if (!spots) {
    res.status(404);
    return res.json({"message": "No spots found"})
  } else {
    for (let spot of spots) {
      spot = spot.toJSON();

      // average rating
      let review = await Review.findAll({
        attributes: [[sequelize.fn("avg", sequelize.col("stars")), "avgStarRating"]],
        where: { spotId: spot.id }
      });
      console.log(review[0]);
      const avgRating = review[0].dataValues.avgStarRating;
      spot.avgRating = avgRating;

      // preview image
      let previewImageURL = await SpotImage.findAll({
        attributes: ["url"],
        where: {
          spotId: spot.id,
          preview: true
        }
      });
      if (previewImageURL[0]) {
        spot.previewImage = previewImageURL[0].url;
      } else {
        spot.previewImage = "No preview image found";
      }
      spotsArray.push(spot);
    }

    // add query filters if exists
    // lat
    if (minLat && maxLat) {
      spotsArray = spotsArray.filter(spot => spot.lat >= minLat && spot.lat <= maxLat)
    } else {
      if (minLat) spotsArray = spotsArray.filter(spot => spot.lat >= minLat)
      if (maxLat) spotsArray = spotsArray.filter(spot => spot.lat <= maxLat)
    }
    //lng
    if (minLng && maxLng) {
      spotsArray = spotsArray.filter(spot => spot.lng >= minLng && spot.lng <= maxLng)
    } else {
      if (minLng) spotsArray = spotsArray.filter(spot => spot.lng >= minLng)
      if (maxLng) spotsArray = spotsArray.filter(spot => spot.lat <= maxLng)
    }
    // price
    if (minPrice && maxPrice) {
      spotsArray = spotsArray.filter(spot => (spot.price >= minPrice) && (spot.price <= maxPrice))
    } else {
      if (minPrice) spotsArray = spotsArray.filter(spot => spot.price >= minPrice)
      if (maxPrice) spotsArray = spotsArray.filter(spot => spot.price <= maxPrice)
    }

    let result = {"Spots": spotsArray};
    result.page = page;
    result.size = size;
    return res.json(result);
  }
});

// GET /api/spots/current
router.get("/current", restoreUser, requireAuth, async (req, res) => {
  let userSpots = await Spot.findAll({
    raw: true,
    where: {ownerId: req.user.id}
  });
  for (let spot of userSpots) {
    // add average rating
    let review = await Review.findAll({
      raw: true,
      attributes: [[sequelize.fn("avg", sequelize.col("stars")), "avgStarRating"]],
      where: {userId: req.user.id}
    });
    if (review) {
      spot.avgRating = review[0].avgStarRating;
    } else {
      spot.avgRating = null;
    }
    // add preview image
    let previewImageURL = await SpotImage.findOne({
      raw: true,
      attributes: ["url"],
      where: {
        spotId: spot.id,
        preview: true
      }
    });

    if (previewImageURL) {
      spot.previewImage = previewImageURL.url;
    } else {
      spot.previewImage = null;
    }
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
  check("address").exists({ checkFalsy: true }).withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country").exists({ checkFalsy: true }).withMessage("Country is required"),
  check("lat").exists({ checkFalsy: true }).withMessage("Latitude is not valid")
    .isDecimal().withMessage("Latitude should be a decimal"),
  check("lng").exists({ checkFalsy: true }).withMessage("Longitude is not valid")
    .isDecimal().withMessage("Longitude should be a decimal"),
  check("name").exists({ checkFalsy: true }).withMessage("Name is required")
    .isLength({ max: 50 }).withMessage("Name should be less than 50 characters"),
  check("description").exists({ checkFalsy: true }).withMessage("Description is required"),
  check("price").exists({ checkFalsy: true }).withMessage("Price per day is required"),
    // .isIn({min: 1}).withMessage("Price per day must be a positive number"),
  handleValidationErrorsSpots
];

// POST /api/spots
// requireAuth
// router.use((req, res, next) => {
//   console.log("+++++++++++++=BEFORE CREATE SPOTS +++++++++++++=")
//   next();
// })

router.post("/", requireAuth, validateCreateSpot, async (req, res) => {
  // console.log("- -------- CREATE SPOT RUNNING -----------")
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

const validateCreateSpotImage = [
  check("url").exists({ checkFalsy: true }).withMessage("URL is required"),
  check("preview").exists({ checkFalsy: true }).withMessage("Please provide a preview selection"),
  handleValidationErrorsSpots
];

// POST /api/spots/:spotId/images
router.post("/:spotId/images", restoreUser, requireAuth, validateCreateSpotImage, async (req, res) => {
  let spot = await Spot.findOne({
    raw: true,
    where: {id: req.params.spotId}
  });

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
      statusCode: 404});
  } else {
    if (spot.ownerId === req.user.id) {
      const { url, preview } = req.body;
      const spotId = req.params.spotId;
      let newSpotImage = await SpotImage.scope(['defaultScope']).create({ spotId, url, preview });
      res.status(200);
      return res.json({
        "id":newSpotImage.id,
        "url":newSpotImage.url,
        "preview": newSpotImage.preview}
      );
    } else {
      res.status(403);
      return res.json("You are not authorized to create an image for this spot.")
    }
  }
});

//PUT /api/spots/:spotId
router.put("/:spotId", restoreUser, requireAuth, validateCreateSpot, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);
    // console.log(spot);
    if (!spot) {
      let error = {
        message: "Spot couldn't be found",
        statusCode: 404
      };
      res.status(404);
      return res.json(error);
    } else {
      if (spot.ownerId === req.user.id) {
        const {address, city, state, country, lat, lng, name, description,price } = req.body;
        await spot.update({address, city, state, country, lat, lng, name, description, price})
        let updatedSpot = await Spot.findByPk(req.params.spotId);
        // console.log(updatedSpot);
        res.status(200);
        return res.json(updatedSpot);
      } else {
        res.status(403);
        return res.json("You are not authorized to update this spot.")
      }
    }
  }
);

// DELETE /api/spots/:spotId

router.delete("/:spotId", requireAuth, async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);
  console.log(spot);
  if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    });
  } else {
    if (spot.dataValues.ownerId === req.user.id) {
      await spot.destroy();
      return res.json({
        message: "Successfully deleted",
        statusCode: 200
      });
    } else {
      res.status(403);
      return res.json("You are not authorized to delete this spot.")
    }
  }
});

// GET /api/spots/:spotId/reviews
router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
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
  // find the spot
  const spot = await Spot.findOne({
      where: {id: req.params.spotId},
      raw: true
    });
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      });
    } else {
      let review = await Review.findOne({
        where: {
          userId: req.user.id,
          spotId: req.params.spotId
       } })
       if (review) {
         res.status(403);
         return res.json({
           message: "User already has a review for this spot",
           statusCode: 403
         });
       } else {
         const { review, stars } = req.body;
         let newReview = await Review.create({
           userId: req.user.id,
           spotId: req.params.spotId,
           review,
           stars
         });
         res.status(201);
         return res.json(newReview);
       }
    }

});

// GET /api/spots/:spotId/bookings
router.get('/:spotId/bookings', requireAuth, async (req,res) => {
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
  if (spot.ownerId === req.user.id) {
    let bookings = await Booking.findAll({
      where: {spotId: req.params.spotId},
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
    });
    if (!bookings[0]) {
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
      "statusCode": 404})
  }
  if (!(spot.ownerId === req.user.id)) {
      let {startDate, endDate} = req.body;
      let startDateTime = new Date(startDate).getTime();
      let endDateTime = new Date(endDate).getTime();
      if (endDateTime <= startDateTime) {
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
          // console.log(bookings);
        for (let i =0 ; i < bookings.length; i++) {
          let booking = bookings[i];
          let existingStart = new Date(booking.startDate).getTime();
          let existingEnd = new Date(booking.endDate).getTime();

          // start/end date is same as existing booking
          if ((existingStart === startDateTime) && (existingEnd === endDateTime)) {
            res.status(403);
              return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                  "startDate": "Start date conflicts with an existing booking",
                  "endDate": "End date conflicts with an existing booking"}})
          // if new booking is within existing booking
          } else if ((startDateTime >= existingStart) && (startDateTime < existingEnd) &&
            (endDateTime > existingStart) && (endDateTime <= existingEnd)) {
              res.status(403);
              return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                   "startDate": "Start date conflicts with an existing booking",
                   "endDate": "End date conflicts with an existing booking"}})
          // if start date is within existing booking
          } else if ((startDateTime >= existingStart) && (startDateTime <= existingEnd)) {
              res.status(403);
              return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                  "startDate": "Start date conflicts with an existing booking"}})
          // if end date is within existing booking
          } else if ((endDateTime >= existingStart) && (endDateTime <= existingEnd)) {
              res.status(403);
              return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                  "endDate": "End date conflicts with an existing booking"}})
          // if booking envelopes existing booking
          } else if ((startDateTime < existingStart) && (endDateTime > existingEnd)) {
            res.status(403);
            return res.json({
              "message": "Sorry, this spot is already booked for the specified dates",
              "statusCode": 403,
              "errors": {
                 "startDate": "Start date conflicts with an existing booking",
                 "endDate": "End date conflicts with an existing booking"}})
          }
            }
            let newBooking = await Booking.create({
              spotId: req.params.spotId,
              userId: req.user.id,
              startDate,
              endDate});
              res.status(200);
              let newBookingJSON = newBooking.toJSON();
              let start = newBookingJSON.startDate.toISOString().slice(0,10);
              let end = newBookingJSON.endDate.toISOString().slice(0,10);
              newBooking.dataValues.startDate = start;
              newBooking.dataValues.endDate = end;
              console.log(newBooking);
              return res.json(newBooking);
          }
      } else {
        return res.json("You cannot book your own spot!")
      }

})



module.exports = router;
