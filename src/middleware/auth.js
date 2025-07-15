const jwt = require("jsonwebtoken");
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid token or user inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

const adminAuth = async (req, res, next) => {
  console.log("req", req.body);
  // try {
  //   await auth(req, res, () => {
  //     if (req.user.role !== 'admin') {
  //       return res.status(403).json({ error: 'Access denied. Admin role required.' });
  //     }
  //     next();
  //   });
  // } catch (error) {
  //   res.status(500).json({ error: 'Authentication error.' });
  // }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(404).json({ message: "Invalid user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    
    console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: "Can't create" });
    }
    next();
  } catch (error) {
    res.status(404).json({ message: "unauthorization" });
  }
};

module.exports = { auth, adminAuth, optionalAuth };
