const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SC_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    else {
      req.User = user; // Use "user" instead of "User" to be consistent with the object properties
      next();
    }
  });
}

const verifyUser = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (req.User.isAdmin === false) {
      next();
    } else {
      res.status(401).json("Bro khong co quyen truy cap cho nay");
    }
  });
};

const verifyAdmin = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (req.User.isAdmin === true) {
      next();
    } else {
      res.status(401).json("Bro khong co quyen truy cap cho nay");
    }
  });
};

module.exports = { authenticateToken, verifyUser, verifyAdmin };
