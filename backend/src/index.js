import { connectDb } from "./db/connectDb.js";
import { app } from "./app.js"
import http from 'http'
import { Server } from "socket.io";
import jwt from 'jsonwebtoken'
import cookie from "cookie";
import { Message } from "./models/message.model.js";




const server = http.createServer(app)

server.on("clientError", (err, socket) => {
  console.error("Client error:", err.message);
  if (socket.writable) {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  }
  socket.destroy();
});

const io = new Server(server, {
  cors: {
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


io.on("connection", (socket) => {
  console.log(`${socket.userId} is connected to socket`)

  socket.on("disconnect", (reason) => {
    console.log(`${socket.userId} is disconnected reason:${reason}`)
  })

  socket.on("joinroom", ({ roomId }) => {
    socket.join(roomId);
    console.log(` ${socket.id} joined the room ${roomId} `);
  })

  socket.on("sendmessage", async (data) => {
    try {
      await Message.create({
        roomId: data.roomId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message
      })
      console.log(data)
      io.to(data.roomId).emit("newmessage", data)

    } catch (error) {
      console.log(error);
      console.log("something went wrong during sending message or creating message schema")

    }
  })

  socket.on("messagereceived",async (data)=>{
    try {
      await Message.findByIdAndUpdate(data.messageId,{
        status:"delivered"
      })
      
    } catch (error) {
      console.log(error)
      console.log("something went wrong during updating message")
    }
  })

})





























// conneection with database and starting the server

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log(error)
    });

    server.listen(process.env.PORT || 8999, () => {
      console.log("server is running")
    })

  })
  .catch((err) => {
    console.log('problem while connecting database', err)
  })