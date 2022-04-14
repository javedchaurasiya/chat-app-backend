const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
require('./config/db')
const cors = require("cors");
const PORT = process.env.PORT || 2000;

const users={}

const corsoptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors(corsoptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hellooo");
});
app.use('/register',require('./Routes/register.js'))
app.use('/login',require('./Routes/login.js'))
app.use('/verifyUser',require('./Routes/verifyUser.js'))
app.use('/getChat',require('./Routes/getChat.js'))
app.use('/searchUser',require('./Routes/searchUser.js'))
app.use('/addUserToChat',require('./Routes/addUserToChat.js'))
app.use('/sendMessage',require('./Routes/sendMessage.js'))
app.use('/imageUpload',require('./Routes/imageUpload.js'))
// app.use('/getImage',require('./Routes/getImage.js'))

io.on("connection", (socket) => {
  // console.log(socket.id);
  socket.emit('requestDetails')
  socket.on('getDetails',(userName)=>{
    // console.log(userName);
    users[userName]=socket.id
    // console.log(users);
  })
  socket.on('removeUser',(userName)=>{
    // console.log(userName);
    delete users[userName]
    // console.log(users);
  })
  socket.on('message',(message,imageURL)=>{
    // console.log(message);
    // console.log(imageURL);
    if(users[message.to])
    {
      socket.to(users[message.to]).emit('onMessage',message,imageURL);
    }
  })
  // socket.emit('hello','rituu raj')
});

httpServer.listen(PORT, () => {
  console.log(`Listenig to port ${PORT}`);
});
