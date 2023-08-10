import {createSlice } from "@reduxjs/toolkit";
// import { Socket } from "socket.io-client";


const roomJoinSlice = createSlice({
  name: "peerInfo",
	initialState: {
	  peerId:"",
	  name: "",
	  roomId: "",
	  video: true,
    audio: true,
    landingPage: true,
    nameArr : []
  },
  reducers: {
    joinRoom: (state, action) => {
      const {peerId, roomId, name,landingPage,video,audio,socket} = action.payload
      state.landingPage = landingPage;
      state.audio = audio;
      state.video = video;
      state.name = name;
      state.peerId = peerId;
      state.roomId = roomId;
      socket.emit("joinRoom",{peerId,roomId,name,video,audio})
      state.nameArr.push(name)
    },
  },
  // extraReducers: (builder) => {
  // 	builder.addCase(myVideoStream.pending, (state) => {
  // 		state.isLoading = true
  // 	})
  // 	builder.addCase(myVideoStream.fulfilled, (state, action) => {
  // 		state.isLoading = false
  // 		state.contents = action.payload
  // 	})
  // 	builder.addCase(myVideoStream.rejected, (state, action) => {
  // 		state.isLoading = false
  // 		state.error = action.error.message
  // 	})
  // }
});

export const { joinRoom} = roomJoinSlice.actions;
export default roomJoinSlice.reducer;
