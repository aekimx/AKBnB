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


router.delete('/:imageId', requireAuth, async (req,res) => {
  let image = await SpotImage.findOne({
    where: {id: req.params.imageId},
    include: {model: Spot, as: 'previewImage'}
  })
  if (!image) {
    res.status(404);
    return res.json({
      "message": "Spot Image couldn't be found",
      "statusCode": 404
    })
  } else {
    let imageJson = image.toJSON();
    if (imageJson.previewImage.ownerId === req.user.id) {
      image.destroy();
      return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
    } else {
      res.status(403);
      return res.json("You are not authorized to delete this image")
    }
  }
})



module.exports = router;
