const router = require("express").Router();
const User = require("../models/user");
const verify = require("../middlewares/verify");

router.post("/", verify, async (req, res) => {
  try {
    const response = await User.findById(req.userId);
    let conversations=await Promise.all(response.conversations.map(async(conversation)=>{
        const result=await User.findOne({userName:conversation.to})
        conversation.imageURL=result.imageURL;
        return conversation;
    }))
    // console.log(conversations);
    return res.status(200).json({ conversations });
  } catch (error) {
    // console.log(error);
    return res.status(404).json({ error });
  }
});

module.exports = router;
