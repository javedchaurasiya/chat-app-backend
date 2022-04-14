const router=require('express').Router()
const User=require('../models/user')
const verify=require('../middlewares/verify')
const crypto=require('crypto')

router.post('/',verify,async(req,res)=>{
    try {
        // console.log(req.userId);
        const {userName,imageURL}=req.body
        const response=await User.findById(req.userId)
        let conversations=response.conversations
        const userFound=conversations.find((conversation)=>{return conversation.to==userName})
        let filteredConversations=conversations.filter((conversation)=>{return conversation.to!=userName})
        let result=userFound;
        if(userFound)filteredConversations.unshift(userFound)
        else
        {
            let newConversation={
                id:crypto.randomBytes(10).toString('hex'),
                to:userName,
                imageURL,
                conversation:[],
            }
            result=newConversation
            filteredConversations.unshift(newConversation)
        }
        const updateResponse=await User.findByIdAndUpdate(req.userId,{conversations:filteredConversations})
        // console.log(updateResponse);
        return res.status(200).json({result})
    } catch (error) {
        // console.log(error);
        return res.status(404).json({error})
    }
})

module.exports=router;