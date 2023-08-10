const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = 7777;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io")
 
  //  https://livevideoapp.onrender.com       
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
}); 

io.on("connection", (socket) => {
  // console.log(socket.id); 
 
    // socket.on("userName", ({ userName }) => {
    //   socket.emit("userName", userName);
    // });
  let peerIdVariable;
  let roomIdVariable;
  socket.on("joinRoom", ({ name, roomId, peerId, video, audio}) => {
    peerIdVariable = peerId
    console.log(name, "roomId" + roomId, peerId, "video:" + video, "audio:" + audio)  
    // console.log(userName)
    socket.join(roomId)
    peerIdVariable = peerId
    roomIdVariable=roomId
    // console.log(userName)
    socket.to(roomId).emit("joined", { roomId, peerId, name, video, audio });
    
    
  //  console.log(video,audio)
    io.to(roomId).emit("userName", name)
    // userName.pop()
  }); 
   
  // socket.on("callEnd", ({ roomId, peerIdNo }) => {
    
  //   socket.to(roomId).emit("callEnd", { peerIdNo });
  // });


  socket.on("videoOff", ({ roomId, peerId }) => {
    // const roomId = JSON.stringify(JSON.parse(roomIdValue))
     console.log(roomId, peerId);
    socket.to(roomId).emit("videoOff", peerId);
  }) 

  socket.on("videoOn", ({ roomId, peerId }) => {
    console.log(roomId, peerId);
    socket.to(roomId).emit("videoOn", peerId)
  })
  
  socket.on("audioOff", ({ roomId, peerId }) => { 
    console.log(roomId, peerId ) 
    socket.to(roomId).emit("audioOff", peerId);
  });
   
  socket.on("audioOn", ({ roomId, peerId }) => {
    console.log(roomId, peerId); 
   socket.to(roomId).emit("audioOn", peerId);
  })

  socket.on("callEnd", ({ roomId,  peerId }) => {
    // console.log(roomId, peerId);
    socket.to(roomId).emit("callEnd", peerId);
  });

  socket.on("disconnect", () => { 
      console.log(peerIdVariable)
    socket.to(roomIdVariable).emit("callDisconnect", peerIdVariable ); 
    // console.log("first")
  });
});
  
server.listen(port, () =>
  console.log("server is running on port " + "" + port)
);
      