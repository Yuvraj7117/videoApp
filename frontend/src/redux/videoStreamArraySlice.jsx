// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// const videoStreamArraySlice = createSlice({
//   name: "video",
//   initialState: 
//     {videoStreamArray:[]}
//   , 
//   reducers: {
//     videoStreamArr: (state, action) => {
// 		const { remoteStream, name, audio, video, peerId, peersList,connectionRef } = action.payload
// 		     if (!peersList.includes(peerId)) {
//            peersList.push(peerId);
//            setPeers(peersList);
           
// 	      state.videoStreamArray = [
//           ...state.videoStreamArray,
//           { remoteStream, name, audio, video, peerID: peerId }
//         ];
        
//            connectionRef.current = myPeer;
//          }
//     //   state.video = action.payload;
//     },
//   },

// });

// export const { videoStreamArr } = videoStreamArraySlice.actions;
// export default videoStreamArraySlice.reducer;
