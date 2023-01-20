const router = require('express').Router();
const sessionRouter = require('./session');
const usersRouter = require('./users');
const { restoreUser } = require('../../utils/auth.js');



router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({requestBody: req.body});
})


// router.get('/restore-user', (req, res) => {
//   return res.json(req.user);
// }
// );
// testing API Router
// router.post('/test', function(req, res) {
//   res.json({requestBody: req.body});
// });


// testing setTokenCookie
// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');

// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//       where: {
//         username: 'Demo-lition'
//       }
//     });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });


// testing restoreUser
// GET /api/restore-user

// testing require authorization
// GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');

// router.get('/require-auth', requireAuth, (req, res) => {
//     return res.json(req.user);
//   }
// );


module.exports = router;
