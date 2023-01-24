const express = require("express");
const {
  Spot,
  Review,
  ReviewImage,
  SpotImage,
  User
} = require("../../db/models");
const { requireAuth, restoreUser } = require("../../utils/auth");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


// GET /spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    raw: true
  });
  for (let spot of spots) {
    let review = await Review.findAll({
      raw: true,
      attributes: ["stars"],
      where: {
        spotId: spot.id
      }
    });
    // add avg rating - refactor later
    let average = 0;
    for (rating of review) {
      average += rating.stars;
    }
    average = average / review.length;
    spot.avgRating = average;

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
  return res.json({ Spots: spots });
});

// GET /api/spots/current
router.get("/current", restoreUser, requireAuth, async (req, res) => {
  console.log(req.user.id);
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
      attributes: ["stars"],
      where: {
        userId: req.user.id
      }
    });
    let average = 0;
    for (rating of review) {
      average += rating.stars;
    }
    average = average / review.length;
    spot.avgRating = average;

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
  return res.json(userSpots);
});

// GET /api/spots/:spotId
router.get("/:spotId", async (req, res) => {
  let id = req.params.spotId;
  let spot = await Spot.findOne({
    include: [{ model: SpotImage }, { model: User, as: "Owner" }],
    where: {
      id: id
    }
  });
  return res.json(spot);
});

const validateCreateSpot = [
  check('address')
    .exists({checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({checkFalsy: true})
    .withMessage('City is required'),
  check('state')
    .exists({checkFalsy: true})
    .withMessage('State is required'),
  check('country')
    .exists({checkFalsy: true})
    .withMessage('Country is required'),
  check('lat')
    .exists({checkFalsy: true})
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({checkFalsy: true})
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({checkFalsy: true})
    .withMessage('Name must be less than 50 characters '),
  check('description')
    .exists({checkFalsy: true})
    .withMessage('Description is required'),
  check('price')
    .exists({checkFalsy: true})
    .withMessage('Price per day is required'),
  handleValidationErrors
];

// POST /api/spots

router.post("/", requireAuth, validateCreateSpot, async(req, res, next) => {
  const {address, city, state, country, lat, lng, name, description, price} = req.body;

  const newSpot = await Spot.create({address, city, state, country, lat, lng, name, description,price});
  res.status(201);
  return res.json(newSpot);
});


module.exports = router;
