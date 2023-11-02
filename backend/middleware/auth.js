const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticateUser = async (req, res, next) => {
  const { token } = req.cookies;

  console.log(token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this resource",
    });
  }

  const decodeData = jwt.verify(token, process.env.SECERT_KEY);

  req.user = await User.findById(decodeData._id);
  next();
};

exports.authorizeRoles = (roles) => {
  return (req, res, next) => {
    console.log({ roles, userRole: req.user});
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(
        `Role: ${
          req.user ? req.user.role : "Unknown"
        } is not allowed to access this resource`
      );
      error.status = 403;
      return next(error);
    }
    next();
  };
};
