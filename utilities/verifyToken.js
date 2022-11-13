const TOKEN = '9aaec1fc-ea13-4783-81f8-a998c1e0d648'

// The route should have a middleware where it uses the user's Bearer Token to get the user's userId (which you will hard code to 9aaec1fc-ea13-4783-81f8-a998c1e0d648)
module.exports = function verifyToken (req, res, next) {
    // THIS IS SUPER HARDCODED FOR A DEMO, DO NOT DO THIS IN PRODUCTION
    const bearerHeader = req.headers['authorization'] || `Bearer ${TOKEN}`

    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }
