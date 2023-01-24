const express = require('express');
const { Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

const router = express.Router();

// GET /spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
    raw: true
  });
  for (let spot of spots) {
    let review = await Review.findAll({
      raw: true,
      attributes: ['stars'],
      where: {
        spotId: spot.id
      }
    });
    let average = 0;
    for (rating of review) {
      average += rating.stars;
    }
    average = average/review.length;
    spot.avgRating = average;

    let previewImageURL = await SpotImage.findAll({
      raw: true,
      attributes: ['url'],
      where: {
        spotId: spot.id,
        preview: true
      }
    })
    spot.previewImage = previewImageURL[0].url;

  }
  return res.json({"Spots": spots});
})



//


module.exports = router;
