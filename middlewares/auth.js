const passport = require('passport');

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const headerToken = req.headers.authorization;
    const accessToken = headerToken.split(' ')[1];
    if (!user || err || accessToken !== user.token) {
      return res.status(401).send({
        status: 'error',
        code: 401,
        data: 'Unauthorized',
        message: 'Not authorized',
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { auth };
