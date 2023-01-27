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
  const reviews = await Review.findAll({
    where: {userId: req.user.id},
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
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });
  if (!reviews[0]) {
    return res.json("No reviews found!");
  } else {
    let previewImage = reviews[0].dataValues.Spot.dataValues.previewImage[0].dataValues.url
    console.log(previewImage);
    reviews[0].dataValues.Spot.dataValues.previewImage = previewImage;
    return res.json({"Reviews": reviews});
  }
})


// POST /api/reviews/:reviewId/images
router.post('/:reviewId/images', async (req,res) => {
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
      const { url } = req.body;
      const newReviewImage = await ReviewImage.create({
        reviewId: req.params.reviewId,
        url
      });
      res.status(201);
      return res.json(newReviewImage);
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
    deletedReview.destroy();
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
})



module.exports = router;
