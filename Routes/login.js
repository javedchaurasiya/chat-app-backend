const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const response = await User.findOne({ userName });
    const check = await bcrypt.compare(password, response.password);
    if (!check) throw new error('Invalid username/password');
    jwt.sign(
      { userId: response._id.toString() },
      process.env.SECRET,
      (error, token) => {
        if (error) throw error
        return res.status(200).json({
          token,
          userName,
          name: response.name,
          imageURL: response.imageURL,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(403).json(error);
  }
});

module.exports = router;
