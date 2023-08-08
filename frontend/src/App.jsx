import React, { useState } from 'react'
import Main from './components/Main';
import { Peer } from "peerjs";
import "./App.css" 
const App = () => {
const myPeer = new Peer();
  return (
    <>
      <Main myPeer={myPeer}/>
    </>
  )
}

export default App