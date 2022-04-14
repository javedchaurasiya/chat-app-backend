const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verify = require("../middlewares/verify.js");

router.post("/", verify, async (req, res) => {
  try {
    // console.log(req.userId);
    const response = await User.findById(req.userId);
    // console.log(response);
    return res.status(200).json({
      userName: response.userName,
      name: response.name,
      imageURL: response.imageURL,
    });
  } catch (error) {
    // console.log(error);
    return res.status(200).json({ error });
  }
});

module.exports = router;
