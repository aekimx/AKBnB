'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

let reviewImages = [
  {
    reviewId: 1,
    url: "reviewimage-1"
  },
  {
    reviewId: 2,
    url: "reviewimage-2"
  },
  {
    reviewId: 1,
    url: "reviewimage-3"
  },
  {
    reviewId: 3,
    url: "reviewimage-4"
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, reviewImages)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, reviewImages);
  }
};
