// import React from "react";
import RoomJoin from "./RoomJoin";
import Video from "./Video";
// const Videos = React.lazy(()=>import("./components/Video")) ;

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { videoStream } from "../redux/videoSlices";

import { joinRoom } from "../redux/roomJoinSlice";
import { audioOn,audioOff,videoOff,videoOn,callEnd } from "../redux/toggleSlice";
// https://livevideoapp.onrender.com
const socket = io("http://localhost:7777/");


function Main({ myPeer}) {
  const [info, setInfo] = useState({ name: "", roomId: "" });
  const [metaData, setMetaData] = useState([]);
  const [landingPage, setLandingPage] = useState(true);
  const [streamId, setStreamId] = useState("");
  const [otherName, setOtherName] = useState([]);
  const [peerId, setPeerId] = useState(" ");
  const [roomIdValue, setRoomIdValue] = useState("");
  const [screen, setScreen] = useState(true);
  const [audioSound, setAudioSound] = useState(true);
  // const [joined, setJoined] = useState(false);
  const [videoVisible, setVideoVisible] = useState(true);
  const myVideo = useRef(null);
  const [peerListAnsArray, setPeerListAnsArray] = useState([]);
  const [videoStreamArray, setVideoStreamArray] = useState([]);
  const [peers, setPeers] = useState([]);
  const [nameArr, setNameArr] = useState([]);
  const [currentName, setCurrentName] = useState([]);
  const [firstUser, setFirstUser] = useState("");
  const [room, setRoom] = useState("");
  const [currentStream, setCurrentStream] = useState();
  const [peersId, setPeersId] = useState("");
  const connectionRef = useRef();
  const isMounted = useRef(false);
  const getStreamRef = useRef();
  const initialVideo = useRef(null);
  const remoteVideo = useRef([]);
  // let remoteIcon = document.getElementById("remoteIcon");
  const remoteHeader = useRef(); 
 

  const dispatch = useDispatch()
  const streamVideo = useSelector(state => state.videoStream.stream)
  const peerInfo = useSelector((state) => state.roomJoinSlice);
  const toggleAudVid = useSelector(state => state.toggleSlice)
  const currentPeerConnection = useRef([]);

  // console.log(peerInfo)
  
  // const stream = getStreamRef.current;

  const joinToRoom = async(peerId, info) => { 
    const { name, roomId } = info;
    setRoomIdValue(roomId);
     let stream = await getStream();
     dispatch(videoStream(stream));

    if (name && roomId) {
      const { name, roomId } = info;
      const {audio,video}=toggleAudVid
     dispatch(joinRoom({name,peerId,roomId,landingPage:false,audio,video,socket}))
    }
    initialVideo.current.srcObject.getTracks().forEach((tracks) => {
      tracks.stop();
    });
  };

  const getStream = () => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: peerInfo.video, audio: peerInfo.audio })
        .then((streams) => {
          resolve(streams);
        });
    });
  }; 

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      myPeer.on("open", (id) => {
        setPeersId(id);
      }); 

    }
  }, []);

  useEffect(() => {
    socket.on("audioOff", (otherPeerId) => {
      let streamArray = JSON.parse(JSON.stringify(videoStreamArray));
      streamArray.forEach((data, index) => {
        streamArray[index].remoteStream = videoStreamArray[index].remoteStream;
        if (data?.peerID == otherPeerId) {
          streamArray[index].remoteStream =
            videoStreamArray[index].remoteStream;
          // if (streamArray[index].audio = true) {
          //   myVideo.current.srcObject.getAudioTracks()[0].enabled = false;
          // }
          streamArray[index].audio = false;
        }
      });
      setVideoStreamArray(streamArray);
    });
    socket.on("audioOn", (otherPeerId) => {
      let streamArray = JSON.parse(JSON.stringify(videoStreamArray));
      streamArray.forEach((data, index) => {
        streamArray[index].remoteStream = videoStreamArray[index].remoteStream;
        if (data?.peerID == otherPeerId) {
          streamArray[index].remoteStream =
            videoStreamArray[index].remoteStream;
          
          // if ((streamArray[index].audio = false)) {
          //   myVideo.current.srcObject.getAudioTracks()[0].enabled = true;
          // }
          
          //  if ((streamArray[index].audio = true)) {
          //    myVideo.current.srcObject.getAudioTracks()[0].enabled = taskCancelledrue;
          //  }
          
          // myVideo.current.srcObject.getAudioTracks()[0].enabled = true;
          streamArray[index].audio = true;
        }
      });

      setVideoStreamArray(streamArray);
    });

    socket.on("videoOff", (otherPeerId) => {
      // console.log(otherPeerId);

      let streamArray = JSON.parse(JSON.stringify(videoStreamArray));
      streamArray.forEach((data, index) => {
        streamArray[index].remoteStream = videoStreamArray[index].remoteStream;
        if (data?.peerID == otherPeerId) {
        
          streamArray[index].video = false;
          // console.log(streamArray[index]);
          // remoteVideo.current[index].style.display = "none";
        }
      });
      setVideoStreamArray(streamArray);
    });

    socket.on("videoOn", (otherPeerId) => {
      let streamArray = JSON.parse(JSON.stringify(videoStreamArray));
      streamArray.forEach((data, index) => {
        streamArray[index].remoteStream = videoStreamArray[index].remoteStream;
        if (data?.peerID == otherPeerId) {
          //  myVideo.current.srcObject.getVideoTracks()[0].enabled = true;
          console.log(streamArray[index]);
          streamArray[index].video = true;
          console.log(streamArray[index]);
          // remoteVideo.current[index].style.display = "block";
        }
      });
      setVideoStreamArray(streamArray);
    });
    socket.on("callDisconnect", (otherPeerId) => {
      // console.log(otherPeerId)
  
      let streamArray = [...videoStreamArray];
      videoStreamArray.forEach((data, index) => {
        // streamArray[index].remoteStream = videoStreamArray[index].remoteStream;
        if (data?.peerID == otherPeerId) {
          // connectionRef.current[index]?.destroy();
          streamArray.splice(index, 1);
        }
      });
      setVideoStreamArray(streamArray);
   })

 
    socket.on("callEnd", (otherPeerId) => {
            // console.log(otherPeerId);

      let streamArray = [...videoStreamArray];
      videoStreamArray.forEach((data, index) => {
        // streamArray[index].remoteStream = videoStreamArray[index].remoteStream;
        if (data?.peerID == otherPeerId) {
          // connectionRef.current[index]?.destroy();
          streamArray.splice(index, 1);
        }
      });
      setVideoStreamArray(streamArray);
    });
  }, [videoStreamArray]); 

  
  useEffect(() => { 
    // console.log(remoteStream)
    // if (videoStreamArray && videoStreamArray.length > 0) {
      videoStreamArray.map((stream, i) => {
        // console.log(stream)
        // if( stream.remoteStream !== {}){
        remoteVideo.current[i].srcObject = stream.remoteStream;
        // remoteHeader.current[i] = stream
        // }
      });
    // }   
  }, [videoStreamArray]);

  const audioONOFF = () => {
    let roomId = roomIdValue;
    let peerId = myPeer.id;
    // let myId = peersId;
    // console.log("first");
    if (toggleAudVid.audio) {
      
      dispatch(audioOff({roomId, peerId,status:false,socket}))
      myVideo.current.srcObject.getAudioTracks()[0].enabled = false;
    } else {
      dispatch(audioOn({ roomId, peerId, status: true ,socket}));
      // socket.emit("audioOn", { roomId, myId });
      // setAudioSound(true);
      myVideo.current.srcObject.getAudioTracks()[0].enabled = true;
    }
    //  console.log(toggleAudVid);
  };

  function videoONOFF() {
    let roomId = roomIdValue;
    let peerId = myPeer.id;
    // console.log(myVideo);
    if (myVideo.current.srcObject.getVideoTracks()[0].enabled) {
      dispatch(videoOff({roomId,peerId,status:false,socket}))
      myVideo.current.srcObject.getVideoTracks()[0].enabled = false;
      // setScreen(false);
      const tracks = myVideo.current.srcObject.getVideoTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    } else {
      dispatch(videoOn({roomId, peerId,status:true,socket}));
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          // console.log(myVideo);
          let audioTrack = myVideo.current.srcObject.getAudioTracks()[0];
          stream.addTrack(audioTrack);  
          myVideo.current.srcObject = stream;
          let vdoTrack = stream.getVideoTracks()[0];
          // setScreen(true);
          // console.log("getSenders", currentPeerConnection.current.getSenders());
          // currentPeerConnection.current.getSenders()
          //     .find((data) => {
          //       return data.track.kind == vdoTrack.kind;
          //     })
          //     .replaceTrack(vdoTrack);
          currentPeerConnection.current.map((RTCPeer) => {
            RTCPeer.getSenders()
              .find((data) => {
                return data.track.kind == vdoTrack.kind;
              })
              .replaceTrack(vdoTrack);
          });
        });
    }
  }
 
  const callEndFun = () => {
    let roomId = roomIdValue;
    let peerId = myPeer.id;
    // console.log(peerId)
   dispatch(callEnd({roomId,peerId,socket}))
    // console.log(roomId,peerId)
    socket.disconnect();
    myPeer.disconnect();
    window.location.reload();
  };
  // console.log(peerInfo.nameArr) 

  return (
    <div
      className="container-fluid mt-4 w-100"
      style={{ display: `${streamId ? "block" : "flex"}` }}
    >
      {peerInfo.landingPage ? (
        <RoomJoin
          info={info}
          setInfo={setInfo}
          // socket={socket}
          peerIdNo={peersId}
          // metaData={metaData}
          // setMetaData={setMetaData}
          // myPeer={myPeer}
          // setPeerId={setPeerId}
          // peerId={peerId}
          // roomIdValue={roomIdValue}
          setRoomIdValue={setRoomIdValue}
          screen={screen}
          setScreen={setScreen}
          audioSound={audioSound}
          setAudioSound={setAudioSound}
          // setJoined={setJoined}
          // videoVisible={videoVisible}
          // setVideoVisible={setVideoVisible}
          myVideo={myVideo}
          setLandingPage={setLandingPage}
          currentName={currentName}
          setCurrentName={setCurrentName}
          joinToRoom={joinToRoom}
          initialVideo={initialVideo}
          toggleAudVid={toggleAudVid}
          dispatch={dispatch}
          // setUserName={setUserName}
          // userName ={userName}
        />
      ) : (
        <Video
          peerIds={peerId}
          screen={screen}
          audioSound={audioSound}
          videoVisible={videoVisible}
          setVideoVisible={setVideoVisible}
          myVideo={myVideo}
          videoStreamArray={videoStreamArray}
          currentName={currentName}
          currentStream={currentStream}
          firstUser={firstUser}
          remoteVideo={remoteVideo}
          room={room}
          audioONOFF={audioONOFF}
          videoONOFF={videoONOFF}
          callEndFun={callEndFun}
          remoteHeader={remoteHeader}
          streamVideo={streamVideo}
          socket={socket}
          myPeer={myPeer}
          setVideoStreamArray={setVideoStreamArray}
          peers={peers}
          setPeers={setPeers}
          setPeerListAnsArray={setPeerListAnsArray}
          connectionRef={connectionRef}
          toggleAudVid={toggleAudVid}
          peerInfo={peerInfo}
          info={info}
          currentPeerConnection={currentPeerConnection}
        />
      )}
      {/* // (
        // <div style={{ position:"absolute"}}>
        //   <h3 className="text-success">
        //     You Now Connected to Room {metaData[0]?.roomId}
        //   </h3>
        // </div>
        // ) */}
    </div>
  );
}

export default Main;
