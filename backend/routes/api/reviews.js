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
  const reviews = await Review.findAll({
    where: {
       userId: req.user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName','lastName']
      },
      {
      model: Spot,
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
      include: {
        model: SpotImage, as: 'previewImage',
        where: {
          preview: true
        },
        attributes: ['url']
      }
      },
      {
        model: ReviewImage
      }
    ]
  });

  let previewImage = reviews[0].dataValues.Spot.dataValues.previewImage[0].dataValues.url
  reviews[0].dataValues.Spot.dataValues.previewImage = previewImage;

  return res.json({"Reviews": reviews});
})





module.exports = router;
