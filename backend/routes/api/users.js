const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({checkFalsy:true})
    .withMessage("First name is required"),
  check('lastName')
    .exists({checkFalsy:true})
    .withMessage("Last name is required"),
  handleValidationErrors
];



// Sign up
router.post('/', validateSignup, async (req, res) => {
    const { email, firstName, lastName, password, username } = req.body;
    let user = await User.signup({ email, firstName, lastName, username, password });

    let token = await setTokenCookie(res, user);
    let signedUpUser = await User.findOne({
      where: {id: user.id},
      attributes: ['id','email','firstName','lastName']
    })

    signedUpUser.dataValues.token = "";
    return res.json({
      "user": signedUpUser
    });
  }
);


module.exports = router;
