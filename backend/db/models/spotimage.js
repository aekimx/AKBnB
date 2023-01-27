'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, {foreignKey: 'spotId', as: 'previewImage'});
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE'
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      validate: {
        checkIfBoolean(value) {
          if ((value !== true) && (value !== false)) throw new Error("Must be true or false!");
        }
      }
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return SpotImage;
};
