import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// const getStream = () => {
//   return new Promise((resolve, reject) => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((streams) => {
//         resolve(streams);
//       });
//   });
// }; 

// export const myVideoStream = createAsyncThunk(
// 	'video/myVideoStream',
// 	async () => {
// 		let stream = await getStream();
// 		return stream
// 	}
// );

const VideoSlice = createSlice({
	name: "video",
	initialState: {
		stream: null,
		// audio:null
	},
	reducers: {
		videoStream: (state, action) => {
			// console.log(action.payload)
			state.stream = action.payload
		}
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
})


export const { videoStream } = VideoSlice.actions
export default VideoSlice.reducer;