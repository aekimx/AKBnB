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
    price: 90
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
  },
  { ownerId: 1,
    address: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
    lat: 40.7128,
    lng: -74.006,
    name: "Cozy Apartment",
    description: "This apartment is perfect for a weekend getaway.",
    price: 100.0
  },
    { ownerId: 2,
      address: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      lat: 34.0522,
      lng: -118.2437,
      name: "Modern Condo",
      description: "Experience luxury living in this beautiful condo.",
      price: 200.0
    },
    { ownerId: 3,
      address: "789 Oak St",
      city: "Chicago",
      state: "IL",
      country: "USA",
      lat: 41.8781,
      lng: -87.6298,
      name: "Charming Bungalow",
      description: "Stay in this cozy bungalow and feel right at home.",
      price: 150.0
    },
    { ownerId: 1,
      address: "1011 Maple St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      lat: 37.7749,
      lng: -122.4194,
      name: "Luxury Penthouse",
      description: "Enjoy breathtaking views from this amazing penthouse.",
      price: 500.0
    },
    { ownerId: 2,
      address: "1213 Pine St",
      city: "Miami",
      state: "FL",
      country: "USA",
      lat: 25.7617,
      lng: -80.1918,
      name: "Tropical Getaway",
      description: "Escape to this beautiful oasis in the heart of Miami.",
      price: 300.0
     },
     { ownerId: 3,
      address: "1415 Cedar St",
      city: "Seattle",
      state: "WA",
      country: "USA",
      lat: 47.6062,
      lng: -122.3321,
      name: "Spacious Loft",
      description: "This loft is perfect for artists and creatives.",
      price: 250.0
    },
    { ownerId: 1,
      address: "1617 Walnut St",
      city: "Philadelphia",
      state: "PA",
      country: "USA",
      lat: 39.9526,
      lng: -75.1652,
      name: "Historic Townhouse",
      description: "Stay in this beautifully restored townhouse and step back in time.",
      price: 175.0
     },
     { ownerId: 2,
      address: "1819 Cherry St",
      city: "Boston",
      state: "MA",
      country: "USA",
      lat: 42.3601,
      lng: -71.0589,
      name: "Cozy Cottage",
      description: "Experience quintessential New England charm in this lovely cottage.",
      price: 125.0
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
