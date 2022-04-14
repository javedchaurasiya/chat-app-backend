const router = require("express").Router();
const hashPassword = require("../middlewares/hashPassword");
const jwt = require("jsonwebtoken");
const crypto=require('crypto')
const User = require("../models/user");
require('dotenv').config()

// const genToken = async (uid) => {
//   try {
//     // var token;
//     jwt.sign({ userId: uid }, process.env.SECRET, (error, token) => {
//       if (error) throw new error();
//       //   console.log(tkn);
//       //   token = tkn;
//       return {token};
//     });
//   } catch (err) {
//     console.log(err);
//     return {error};
//   }
// };

router.post("/", hashPassword, async (req, res) => {
  try {
    // console.log("Register");
    // console.log(req.hash);
    const hash = req.hash;
    const { userName, email, name } = req.body;
    var conversations=[]
    conversations.push({
      id:crypto.randomBytes(10).toString('hex'),
      to:'chat-app(demo)',
      imageURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMMM9ueXIMnORtNeXdG7ywL7u2UGrc0uqkpg&usqp=CAU',
      conversation:[{
        from:'chat-app',
        to:userName,
        content:'hey',
        timeline:Date.now(),
        id:crypto.randomBytes(10).toString('hex')
      },{
        from:'chat-app',
        to:userName,
        content:'whatsup',
        timeline:Date.now(),
        id:crypto.randomBytes(10).toString('hex')
      },{
        from:'chat-app',
        to:userName,
        content:'welcome to chat-app',
        timeline:Date.now(),
        id:crypto.randomBytes(10).toString('hex')
      },]
    })
    const newUser = new User({
      userName,
      email,
      name,
      password: hash,
      conversations,
    });
    const response = await newUser.save();
    // console.log(response);

    jwt.sign(
      { userId: response._id.toString() },
      process.env.SECRET,
      (error, token) => {
        if (error) throw error
        return res.status(200).json({
          token,
          userName,
          name,
          imageURL: response.imageURL,
        });
      }
    );
  } catch (error) {
    // console.log(error);
    return res.status(403).json({ error });
  }
});

module.exports = router;
