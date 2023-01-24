'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

let spotImages = [
  {
    spotId: 1,
    url: "spotimage-1.com",
    preview: true
  },
  {
    spotId: 1,
    url: "spotimage-1-2.com",
    preview: false
  },
  {
    spotId: 2,
    url: "spotimage2.com",
    preview: true,
  },
  {
    spotId:3,
    url: "spotimage3.com",
    preview: true
  }
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, spotImages)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
