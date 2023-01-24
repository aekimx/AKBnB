const express = require('express');
const { Spot } = require('../../db/models');


router.get('/spots', async (req, res) => {
  const spots = await Spot.findAll();
  return res.json(spots);
})

const router = express.Router();
