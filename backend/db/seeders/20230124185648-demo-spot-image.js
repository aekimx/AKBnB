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
    preview: true
  },
  {
    spotId:6,
    url: "https://photos.zillowstatic.com/fp/ff4a7f9527ff9ddb1162b837c415ecd7-p_e.jpg",
    preview: true
  },
  {
    spotId: 7,
    url: "https://s3.amazonaws.com/twotreesny/mh1200x854-1647635818817.jpeg",
    preview: true
  },
  {
    spotId: 7,
    url: "https://thumbs.cityrealty.com/assets/smart/736x/webp/2/22/22ca6350cd0dcc474556e1e06bd8144482a45135/15-central-park-west-01.jpg",
    preview: false
  },
  {
    spotId: 8,
    url: "https://image.cnbcfm.com/api/v1/image/104885357-rsz_ten_thousand_penthouse.jpg?v=1512677265&w=1600&h=900",
    preview: true
  },
  {
    spotId: 8,
    url: "https://lirp.cdn-website.com/dd256585/dms3rep/multi/opt/aplus_backgroundimagedesktop_1900x1267_olivedtla_2017_bdg1_self-1920w.jpg",
    preview: false
  },
  {
    spotId: 9,
    url: "https://www.rentcafe.com/blog/wp-content/uploads/sites/62/2016/09/Catalyst_Facebook_photo.jpg",
    preview: true
  },
  {
    spotId: 9,
    url: "https://s3-prod.chicagobusiness.com/old%20town%201.jpg",
    preview: false
  },
  {
    spotId: 10,
    url: "https://s.hdnux.com/photos/01/26/04/23/22562022/4/rawImage.jpg",
    preview: true
  },
  {
    spotId: 10,
    url: "https://s.hdnux.com/photos/01/25/72/31/22521471/7/1200x0.jpg",
    preview: false
  },
  {
    spotId: 11,
    url: "https://imageio.forbes.com/blogs-images/amydobson/files/2018/12/RenzoTerrace-1200x675.jpg?format=jpg&width=1200",
    preview: true
  },
  {
    spotId: 11,
    url: "https://www.57ocean.com/wp-content/themes/57ocean/images/57OCEAN_PH_14_Plunge-Pools.jpg",
    preview: false
  },
  {
    spotId: 12,
    url: "https://img.gtsstatic.net/reno/imagereader.aspx?imageurl=https%3A%2F%2Fsir.azureedge.net%2F1194i215%2F108m2s70aca6meacsx7cr0ch44i215&option=N&h=472&permitphotoenlargement=false",
    preview: true
  },
  {
    spotId: 12,
    url: "https://www.tripsavvy.com/thmb/8L6QGTBt-Y8PpTJzpTbPPqFR1VM=/2121x1414/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-200334603-001-5b875e50c9e77c0050cf2162.jpg",
    preview: false
  },
  {
    spotId: 13,
    url: "https://www.extraspace.com/wp-content/uploads/2021/04/best-places-buy-home-philly.jpg",
    preview: true
  },
  {
    spotId: 13,
    url: "https://images.squarespace-cdn.com/content/v1/5d9f80225151ac1b8ac3b9c2/1623770465774-MCZXPPQHEHLO6N289BNL/shutterstock_618666875.jpg",
    preview: false
  },
  {
    spotId: 14,
    url: "https://cdn10.bostonmagazine.com/wp-content/uploads/sites/2/2017/02/beautiful-suburbs-homes-2.jpg",
    preview: true
  },
  {
    spotId: 14,
    url: "https://static1.thetravelimages.com/wordpress/wp-content/uploads/2022/12/acorn-street-boston.jpg",
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
