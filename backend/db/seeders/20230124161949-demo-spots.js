'use strict';

const { query } = require('express');
const {Spot, User, Review, SpotImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

const spots = [
  {
    ownerId: 1,
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123
  },
  {
    ownerId: 2,
    address: "124 Joe Lane",
    city: "New York",
    state: "New York",
    country: "United States of America",
    lat: 100.7345318,
    lng: 32.4730327,
    name: "Joe House",
    description: "Place where Joe lives ",
    price: 312
  },
  {
    ownerId: 3,
    address: "333 E 30th Street",
    city: "Boston",
    state: "Massachusetts",
    country: "United States of America",
    lat: 205.7345318,
    lng: -76.678921,
    name: "Bobs House",
    description: "Place where Bob lives ",
    price: 100
  },
  {
    ownerId: 3,
    address: "123 Maple Street",
    city: "Chicago",
    state: "Illinois",
    country: "United States of America",
    lat: 1.0244,
    lng: -74.678921,
    name: "Beautiful Suburban House",
    description: "Wonderful house in outskirts of Chicago.",
    price: 213
  },
  {
    ownerId: 1,
    address: "37 Windwood Drive",
    city: "Portland",
    state: "Maine",
    country: "United States of America",
    lat: 23.45550,
    lng: 24.1455,
    name: "Beachhouse",
    description: "Gorgeous beachhouse in the heart of Maine",
    price: 455
  },
  {
    ownerId: 2,
    address: "29 Summershow Drive",
    city: "Boston",
    state: "Massachusetts",
    country: "United States of America",
    lat: 0,
    lng: 1.00,
    name: "Testing House",
    description: "Place to be if you wnat to relax",
    price: 213
  }
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, spots)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, spots)
  }
};
