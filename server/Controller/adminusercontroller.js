const User = require("../Model/user.model");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).send("No users found.");
    }
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers };
