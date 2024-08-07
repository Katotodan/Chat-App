const express = require("express")
const mongoose = require("mongoose")
const authRouter = require("./Routes/auth")
const messageRouter = require("./Routes/messageRouter")
const cors = require('cors')
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)

// Socket import
const { createServer } = require("http");
const { Server } = require("socket.io");


mongoose.connect("mongodb://127.0.0.1:27017/Chat-App")
.then(() => console.log('Mongodb running'))
.catch( err => console.log('Mongodb not running'))

const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/Chat-App',
    collection: 'mySessions'
})

const app = express()

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000})) 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your React app's origin
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(session({ 
    secret: 'keyboard cat',
    resave: false, 
    saveUninitialized: false,
    store: store
})); 
app.use(passport.authenticate('session'));
app.use("/", authRouter)
app.use("/", messageRouter)
  

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
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
            console.log('New user has been connected')
        }else{
            for(let i=0; i<onlineUser.length; i++){
                if(onlineUser[i]["userId"] == userId){
                    break  
                }
                if(i == onlineUser.length - 1){
                    onlineUser.push({"userId": userId, "socketId": socket.id})
                    console.log('New user has been connected')
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
        console.log('user disconnected');
        onlineUser = onlineUser.filter(obj => obj.socketId !== socket.id)
      }); 
      
  // ... 
});


httpServer.listen("5000", () => console.log('Server running on port 5000'))
