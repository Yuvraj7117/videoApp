// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { userAPI } from './userAPI'


// const getStream = () => {
//   return new Promise((resolve, reject) => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((streams) => {
//         resolve(streams);
//       });
//   });
// };

// // First, create the thunk
// const fetchUserById = createAsyncThunk(
//   'stream',
//   async () => {
//     const response = await getStream()
//     return response.data
//   }
// )

// interface UsersState {
//   entities: []
//   loading: 'idle' | 'pending' | 'succeeded' | 'failed'
// }

// const initialState = {
//   entities: [],
//   loading: 'idle',
// } as UsersState

// // Then, handle actions in your reducers:
// const usersSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {
//     // standard reducer logic, with auto-generated action types per reducer
//   },
//   extraReducers: (builder) => {
//     // Add reducers for additional action types here, and handle loading state as needed
//     builder.addCase(fetchUserById.fulfilled, (state, action) => {
//       // Add user to the state array
//       state.entities.push(action.payload)
//     })
//   },
// })

// // Later, dispatch the thunk as needed in the app
// dispatch(fetchUserById(123))