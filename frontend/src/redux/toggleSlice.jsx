import { createSlice } from "@reduxjs/toolkit";
// import { Socket } from "socket.io-client";

const toggleSlice = createSlice({
    name: "toggling",
	initialState: {
		audio: true,
		video:true
  },
  reducers: {
	  audioOn: (state, action) => {
		  const { roomId, peerId, socket, status } = action.payload
		  console.log(peerId)
		  state.audio = status;
		  if (socket) {
			  socket.emit("audioOn", { roomId,peerId});
		  }
	},
	  audioOff: (state, action) => {
		  const { roomId, peerId, socket, status } = action.payload;
		  console.log(peerId)
		  state.audio = status;
		  if (socket) {
			  socket.emit("audioOff", { roomId, peerId });
		 }
	},
	  videoOn: (state, action) => {
		  const { roomId, peerId, socket, status } = action.payload
		  console.log(peerId) 
          state.video = status;
		  if (socket) {
			  socket.emit("videoOn", { roomId, peerId });
		  }
	},
	  videoOff: (state, action) => {
		  const { roomId, peerId, socket, status } = action.payload;
		//   console.log(peerId)
		//   console.log(socket)
          state.video = status;
		  if (socket) {
			  socket.emit("videoOff", { roomId, peerId });
		  }
	},
	  callEnd: (state, action) => {
		  const { roomId, peerId, socket } = action.payload;
		  console.log(socket)
		  if (socket) {
			socket.emit("callEnd", { roomId, peerId });
		}
	},
  },

});

export const { audioOn,audioOff,videoOff,videoOn,callEnd } = toggleSlice.actions;
export default toggleSlice.reducer;
