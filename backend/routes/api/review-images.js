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
  let image = await ReviewImage.findOne({
    where: {id: req.params.imageId},
    include: {model: Review}
  })
  console.log(image);
  if (!image) {
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  } else {
    res.json("yes!");
  }
})






module.exports = router;
