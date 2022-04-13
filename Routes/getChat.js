const router=require('express').Router()
const User=require('../models/user')
const verify=require('../middlewares/verify')

router.post('/',verify,async(req,res)=>{
    try {
        const response=await User.findById(req.userId);
        return res.status(200).json({conversations:response.conversations})
    } catch (error) {
        console.log(error);
        return res.status(404).json({error})
    }
})

module.exports=router;