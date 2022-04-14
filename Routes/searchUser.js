const router = require("express").Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { userName } = req.body;
    const userNameRegex = new RegExp(userName.split("").join("\\s*"));
    const response = await User.find({
      userName: { $regex: userNameRegex, $options: "xi" },
    });
    // console.log(response);
    let result = [];
    response.map((user) =>
      result.push({
        name: user.name,
        userName: user.userName,
        imageURL: user.imageURL,
      })
    );
    // console.log(result);
    return res.status(200).json({ result });
  } catch (error) {
    // console.log(error);
    return res.status(404).json({ error });
  }
});

module.exports = router;
