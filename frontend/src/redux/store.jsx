import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import videoReducer from "./videoSlices";
import roomJoinSlice from "./roomJoinSlice";
import toggleSlice from "./toggleSlice";
// import videoStreamArraySlice from "./videoStreamArraySlice";
// import {streamReducer} from "./getStreamSlice";

 const store = configureStore({
   reducer: {
     videoStream: videoReducer,
     roomJoinSlice, 
     toggleSlice,
    //  videoStreamArray:videoStreamArraySlice
     
    //  streamReducer
   },
   middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware({
       serializableCheck: {
         // Ignore these action types
         ignoredActions: ["video/videoStream", "peerInfo/joinRoom","payload.socket"],
         // Ignore these field paths in all actions
         ignoredActionPaths: ["meta.arg", "payload.timestamp","payload.socket"],
         // Ignore these paths in the state
         ignoredPaths: ["videoStream.stream"],
       },
     }).concat(logger),
 }); 

export default store;   