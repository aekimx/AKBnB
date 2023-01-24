const express = require('express');
const { Review } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res)=> {
  const reviews = await Review.findAll();
  return res.json(reviews);
})


module.exports = router;
