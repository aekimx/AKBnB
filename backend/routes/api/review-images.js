const express = require("express");
const {
  Review,
  ReviewImage,
  sequelize
} = require("../../db/models");
const { requireAuth, restoreUser } = require("../../utils/auth");

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res) => {
  let image = await ReviewImage.findOne({
    where: {id: req.params.imageId},
    include: {model: Review}
  })
  let imageJSON = image.toJSON();
  if (!image) {
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  } else {
    if (imageJSON.Review.userId === req.user.id) {
      image.destroy();
      return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
    } else {
      return res.json("You are not authorized to delete this review image");
    }
  }
})






module.exports = router;
