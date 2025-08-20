import { connectDb } from "./db/connectDb.js";
import {app} from "./app.js"
import http from 'http'
import { Server } from "socket.io";
import jwt from 'jsonwebtoken'
import cookie from "cookie";




const server = http.createServer(app)

const io = new Server(server,{
    cors:{
         origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
    }
})

io.use((socket, next) => {
  try {
    const rawCookie = socket.handshake.headers.cookie;
    if (!rawCookie) return next(new Error("No cookies sent"));

    const parsed = cookie.parse(rawCookie);
    const token = parsed.accessToken;
    if (!token) return next(new Error("No accessToken cookie"));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRATE);
    socket.userId = decoded._id;

    next();
  } catch (err) {
    console.error("❌ Socket auth failed:", err.message);
    next(new Error("Authentication failed"));
  }
});
io.on("connection",(socket)=>{
    console.log(`${socket.userId} is connected to socket`)

    socket.on("disconnect",(reason )=>{
         console.log(`${socket.userId} is disconnected reason:${reason}`)
    })
 
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