const express = require('express');
const {
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

// GET /reviews/current
router.get('/current', restoreUser, requireAuth, async (req, res)=> {
  let reviews = await Review.findAll({
    where: {userId: req.user.id},
    include: [
      {
        model: User,
        attributes: ['id', 'firstName','lastName']
      },
      {
      model: Spot,
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });

  if (!reviews[0]) {
    return res.json("No reviews found!");
  } else {
    for (let i = 0; i < reviews.length; i++) {
      let review = reviews[i].toJSON();

      let previewImage = await SpotImage.findOne({
        raw: true,
        where: {
          preview: true,
          spotId: review.spotId
        },
        attributes: ['url']
      })
      if (!previewImage) {
        reviews[i].dataValues.Spot.dataValues.previewImage = null;
      } else {
        reviews[i].dataValues.Spot.dataValues.previewImage = previewImage.url;
      }
    }
    return res.json({"Reviews": reviews});
  }
})

const validateCreateReviewImage = [
  check("url")
    .exists({ checkFalsy: true })
    .withMessage("URL is required"),
  handleValidationErrorsSpots
];

// POST /api/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, validateCreateReviewImage, async (req,res) => {
  const review = await Review.findByPk(req.params.reviewId);
  // if review doesn't exist
  if (!review) {
    res.status(404);
    return res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  } else {
     // if there are more than 10 review images for the review
    let images = await ReviewImage.findAll({
      raw: true,
      where: {reviewId: req.params.reviewId},
      attributes: [[sequelize.fn('count', sequelize.col('url')), 'reviewImages']]
    })
    if (images[0].reviewImages >= 10) {
      res.status(403);
      return res.json({
        "message": "Maximum number of images for this resource was reached",
        "statusCode": 403
      })
    } else {
      if (review.userId === req.user.id) {
        const { url } = req.body;
        const newReviewImage = await ReviewImage.create({
          reviewId: req.params.reviewId,
          url
        });
        res.status(201);
        return res.json({
          "id": newReviewImage.dataValues.id,
        "url": newReviewImage.dataValues.url});
      } else {
        return res.json("You are not authorized to add an image to this review")
      }
    }
  }
})

const validateEditReview = [
  check('review')
    .exists({checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({checkFalsy: true})
    .withMessage('You must provide star rating')
    .isIn([1,2,3,4,5])
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrorsSpots
];


// PUT /api/reviews/:reviewId
router.put('/:reviewId', restoreUser, requireAuth, validateEditReview, async(req,res) => {
   let updateReview = await Review.findOne({
    where: {
      id: req.params.reviewId
    },
    raw:true
  });
   if (!updateReview) {
    res.status(404);
    return res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
   } else {
    if (updateReview.userId === req.user.id) {
      const {review, stars} = req.body;
      updateReview.review = review;
      updateReview.stars = stars;
      return res.json(updateReview);
    }
   }
})

// DELETE /api/reviews/:reviewId
router.delete('/:reviewId', restoreUser, requireAuth, async (req,res) => {
  let deletedReview = await Review.findByPk(req.params.reviewId);
  if (!deletedReview) {
    res.status(404)
    return res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  } else {
    // console.log(deletedReview);
    if (deletedReview.dataValues.userId === req.user.id) {
      deletedReview.destroy();
      res.status(200)
      return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
    } else {
      return res.json("You are not authorized to delete this review.")
    }
  }
})



module.exports = router;
