'use strict';
const {
  Model, Validator
} = require('sequelize');

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // create object with only User instance info that is safe to save to a JWT
    toSafeObject() {
      const {id, firstName, lastName, username, email } = this;
      return {id, firstName, lastName, username, email};
    };

    // return true if match, return false if not a match
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    };

    // get current user by Id
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    };

    // static login method to find the user, and if found validate password
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    };

    // static signup method to create the user and return the created user's info
    static async signup({username, email, password, firstName, lastName}) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName
      })
      return await User.scope('currentUser').findByPk(user.id);
    }

    static associate(models) {
      // define association here
      User.belongsToMany(models.Spot, {
        through: 'Booking',
        foreignKey: 'userId',
        otherKey: 'spotId'
      })

      User.belongsToMany(models.Spot, {
        through: 'Review',
        foreignKey: 'userId',
        otherKey: 'spotId'
      });

      User.hasMany(models.Spot, {foreignKey: 'ownerId', as: 'Owner'});

    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) throw new Error('Cannot be an email.');
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'updatedAt', 'email', 'createdAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword']}
      },
      loginUser: { attributes: {}} // what is this for ...?
    }
  });
  return User;
};
