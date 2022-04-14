require('dotenv').config()
const User=require('../models/user')
const jwt=require('jsonwebtoken')

const verify = async (req, res, next) => {
  try {
    var { authentication } = req.headers;
    // console.log(authentication);
    const token=authentication.split(' ')[1];
    // console.log(token);

    jwt.verify(token,process.env.SECRET,(error,payload)=>{
        if(error)throw error
        const userId=payload.userId
        // const response=await User.findById(userId)
        // console.log(response);
        req.userId=userId
    })
    next();
  } catch (error) {
    // console.log(error);
    return res.status(403).json(error);
  }
};

module.exports = verify;
