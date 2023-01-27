'use strict';
const { Model, Op} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsToMany(models.User, {
        through: 'Booking',
        foreignKey: 'spotId',
        otherKey: 'userId'
      });
      Spot.belongsToMany(models.User, {
        through: 'Review',
        foreignKey: 'spotId',
        otherKey: 'userId'
      })

      Spot.belongsTo(models.User, {foreignKey: 'ownerId', as: "Owner"})

      Spot.hasMany(models.SpotImage, {foreignKey: 'spotId', as: "previewImage", onDelete: 'CASCADE', hooks: true});

      Spot.hasMany(models.Review, {foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true});

      Spot.hasMany(models.Booking, {foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true})

    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          [Op.gt]: 0
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {[Op.gt]: 0},
        isAlpha:true
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {[Op.gt]: 0},
        isAlpha: true
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {[Op.gt]: 0},
        isAlpha: true
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {[Op.between]: [1,50]}
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
