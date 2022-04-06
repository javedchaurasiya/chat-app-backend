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

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.emit('requestDetails')
  socket.on('getDetails',(userName)=>{
    console.log(userName);
    users[userName]=socket.id
    console.log(users);
  })
  // socket.emit('hello','rituu raj')
});

httpServer.listen(PORT, () => {
  console.log(`Listenig to port ${PORT}`);
});
