const express = require("express")
const mongoose = require("mongoose")
const authRouter = require("./Routes/auth")
const messageRouter = require("./Routes/messageRouter")
const passport = require('passport');
const session = require('express-session');
const cors = require("cors")
const MongoDBStore = require('connect-mongodb-session')(session)
require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 5000
// Socket import
const { createServer } = require("http");
const { Server } = require("socket.io");


const store = new MongoDBStore({
    uri: process.env.MONGO_DB_URI,
    collection: 'mySessions'
})

// Middleware
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Access-Control-Allow-Credentials', 
        'Access-Control-Allow-Origin',
    ],
    credentials: true
}))


app.use(session({ 
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, 
    saveUninitialized: false,
    store: store,
})); 
app.use(passport.authenticate('session'));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
 

app.use("/", authRouter)
app.use("/", messageRouter)
  

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    } 
});

let onlineUser = []
const getSenderId = (socketId) =>{
    for(let i=0; i<onlineUser.length; i++){
        if(onlineUser[i]["socketId"] == socketId){
            return onlineUser[i]["userId"]
        }
    }
}
io.on("connection", (socket) => {
    socket.on("user_connect", (userId) =>{
        if(onlineUser.length < 1){
            onlineUser.push({"userId": userId, "socketId": socket.id})
        }else{
            for(let i=0; i<onlineUser.length; i++){
                if(onlineUser[i]["userId"] == userId){
                    break  
                }
                if(i == onlineUser.length - 1){
                    onlineUser.push({"userId": userId, "socketId": socket.id})
                } 
            }
        }  
    }) 

    socket.on("messageSend", ([message, toUserId]) =>{
        for(let i = 0; i < onlineUser.length; i++){
            if(onlineUser[i]["userId"] == toUserId){
                io.to(onlineUser[i]["socketId"]).emit("sendSpecificMsg", [getSenderId(socket.id), message])
                break  
            }  
            
        }     
    })

    socket.on('disconnect', () => {
        onlineUser = onlineUser.filter(obj => obj.socketId !== socket.id)
      }); 
      
  // ... 
});
const startServer = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log('Mongodb running')
        httpServer.listen(PORT, () => console.log('Server running on port ' + PORT))
    } catch (error) {
        console.log(error.message)
    }  
}
startServer()

// Next step is to work on responsiveness

