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
  {
    spotId:4,
    url: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyamin-mellish-186077.jpg&fm=jpg",
    preview: true
  },
  {
    spotId:4,
    url: "https://images.squarespace-cdn.com/content/v1/5bae9dedb914493e0610b548/1594734908568-AV0SBYS2BAU675L0959C/Generation%2BHomes%2BRenovations%2BUpdated%2BKitchen%2BModern%2BFarmhouse%2BIndustrial.jpg?format=1000w",
    preview: false
  },
  {
    spotId:5,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgrm/fullset/2011/7/26/0/DP_Thomas-Oppelt-italian-style-kitchen_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1405454818754.jpeg",
    preview: false
  },
  {
    spotId:5,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgrm/fullset/2011/7/26/0/DP_Thomas-Oppelt-italian-style-kitchen_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1405454818754.jpeg",
    preview: false
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
