import { connectDb } from "./db/connectDb.js";
import {app} from "./app.js"
import http from 'http'
import { Server } from "socket.io";
import jwt from 'jsonwebtoken'


const server = http.createServer(app)

const io = new Server(server,{
    cors:{
         origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
    }
})

io.use((socket,next)=>{

const token = socket.handshake.auth.token
if(!token){
    return next(new Error("invalid credential"))
}

try {

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRATE);
    socket.userId = decodedToken._id;
    next();
    
} catch (error) {
    console.log("thier is an error while verifying jwt in socket connection")
}

})
io.on("connection",(socket)=>{
    console.log(`${socket.userId} is connected to socket`)
})

socket.on("disconnect",(reason )=>{
     console.log(`${socket.userId} is disconnected reason:${reason}`)
})

 connectDb()
.then(()=>{
    app.on("error",(error)=>{
        console.log(error)
    });

    server.listen(process.env.PORT || 8999,()=>{
        console.log("server is running")
    })
    
})
.catch((err)=>{
console.log('problem while connecting database',err)
})