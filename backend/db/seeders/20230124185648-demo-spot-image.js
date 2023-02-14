'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

let spotImages = [
  {
    spotId: 1,
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2V8ZW58MHx8MHx8&w=1000&q=80",
    preview: true
  },
  {
    spotId: 1,
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8&w=1000&q=80",
    preview: false
  },
  {
    spotId: 2,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5wYUbLO04r5LHe718NGwur3J9KC-5nvb2Kg&usqp=CAU",
    preview: true,
  },
  {
    spotId:3,
    url: "https://www.travelandleisure.com/thmb/IIBEmIubzmP-HBJv4l_nPUQidUE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/green-o-treehouse-montana_HERO_TREEHOUSE0822-219f8b36f0dd4421993eed3e8de274dc.jpg",
    preview: true
  },
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, spotImages)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, spotImages);
  }
};
