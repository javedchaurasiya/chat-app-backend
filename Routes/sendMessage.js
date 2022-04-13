const router=require('express').Router()
const User=require('../models/user')
const verify=require('../middlewares/verify')
const crypto=require('crypto')

router.post('/',verify,async(req,res)=>{
    try {
        const {message}=req.body
        const sender=await User.findById(req.userId)
        const receiver=await User.findOne({userName:message.to})
        let receiverConversations=receiver.conversations
        const senderFound=receiverConversations.find((conversation)=>{return conversation.to==sender.userName})
        let rFilteredConversations=receiverConversations.filter((conversation)=>{return conversation.to!=sender.userName})
        // let result=senderFound;
        if(senderFound)
        {
            rFilteredConversations.unshift(senderFound)
            rFilteredConversations[0].conversation.push(message)
        }
        else
        {
            let newConversation={
                id:crypto.randomBytes(10).toString('hex'),
                to:sender.userName,
                imageURL:sender.imageURL,
                conversation:[],
            }
            newConversation.conversation.push(message)
            // result=newConversation
            rFilteredConversations.unshift(newConversation)
        }
        const rUpdateResponse=await User.findOneAndUpdate({userName:message.to},{conversations:rFilteredConversations})
        // console.log(rUpdateResponse);
        let senderConversations=sender.conversations;
        const receiverFound=senderConversations.find((conversation)=>{return conversation.to==message.to})
        senderConversations=senderConversations.filter((conversation)=>{return conversation.to!=message.to})
        senderConversations.unshift(receiverFound)
        senderConversations[0].conversation.push(message);
        // console.log(senderConversations);
        const sUpdateResponse=await User.findByIdAndUpdate(req.userId,{conversations:senderConversations})
        return res.status(200).json({success:true})
    } catch (error) {
        console.log(error);
        return res.status(400).json({error})
    }
})

module.exports=router;