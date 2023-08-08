// import React from "react";
import RoomJoin from "./RoomJoin";
import Video from "./Video";
// const Videos = React.lazy(()=>import("./components/Video")) ;

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";


// https://livevideoapp.onrender.com
const socket = io("https://livevideoapp.onrender.com");


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

  const stream = getStreamRef.current;

  const joinToRoom = (peerId, info) => {
    const { name, roomId } = info;
    setRoomIdValue(roomId);
    setMetaData([info]);
    setCurrentName([...currentName, info.name]);
    if (name && roomId) {
      setLandingPage(false);
      const { name, roomId } = info;
      socket.emit("joinRoom", {
        peerId: peerId,
        name,
        roomId,
        video: screen,
        audio: audioSound,
        // userName
      });
    }
    initialVideo.current.srcObject.getTracks().forEach((tracks) => {
      tracks.stop();
    });
  };


  const getStream = () => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((streams) => {
          resolve(streams);
        });
    });
  }; 

//   const getName = () => {
//     setInfo((perv)=>[...prev,info])
//   }
//  console.log(info)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      // console.log(getName())
      myPeer.on("open", (id) => {
 
        setPeersId(id);
      }); 
// console.log(info.name)
      async function initiateStream() {
        let stream = await getStream();
        setCurrentStream(stream);

        socket.on("joined", (data) => {
          const { peerId, name, roomId, video, audio } = data;
          console.log(peerId);
          setFirstUser(name);
          // setOtherName([...otherName, name]);

          setPeersId(peerId);

          const call = myPeer.call(peerId, stream, {
            metadata: { userName: info.name, audio: audio, video: video },
          });

          let peersList = JSON.parse(JSON.stringify(peers));
          call.on("stream", (remoteStream) => {
            console.log(remoteStream);
            if (!peersList.includes(peerId)) {
              peersList.push(peerId);
              setPeers(peersList);

              setStreamId(remoteStream.id);
              setRoom(call.id);
              setVideoStreamArray((prev) => [
                ...prev,
                { remoteStream, name, audio, video, peerID: peerId },
              ]);
              setNameArr((prev) => [...prev, call.metadata.userName]);
              connectionRef.current = myPeer;
            }
          });

          // getStreamRef.current = streamVideo;
          // socket.emit("stopVideo", { peerId, roomId})
        });

        myPeer.on("call", (call) => {
          // console.log("callfghj",call)
          // myPeer.current.srcObject = getStreamRef.current
          console.log(stream);
          call.answer(stream);
          let peersList = JSON.parse(JSON.stringify(peers));
          call.on("stream", (remoteStream) => {
            if (!peersList.includes(call.peer)) {
              peersList.push(call.peer);
              setPeers(peersList);
              setPeerListAnsArray((prev) => [...prev, call.peerConnection]);
              setVideoStreamArray((prev) => [
                ...prev,
                { 
                  remoteStream,
                  name: call.metadata.userName,
                  audio: call.metadata.audio,
                  video: call.metadata.video,
                  peerID: call.peer,
                },
              ]);
              setNameArr((prev) => [...prev, call.metadata.userName]);
              connectionRef.current = myPeer;
              //  console.log(remoteStream);
            }
          });
        });
      }

      initiateStream();
    }
  }, []);

  useEffect(() => {
    socket.on("audioOff", (otherPeerId) => {
      let streamArray = JSON.parse(JSON.stringify(videoStreamArray));
      streamArray.forEach((data, index) => {
        if (data?.peerID == otherPeerId) {
          streamArray[index].remoteStream =
            videoStreamArray[index].remoteStream;
          myVideo.current.srcObject.getAudioTracks()[0].enabled = false;
          streamArray[index].audio = false;
        }
      });
      setVideoStreamArray(streamArray);
    });
    socket.on("audioOn", (otherPeerId) => {
      let streamArray = JSON.parse(JSON.stringify(videoStreamArray));
      streamArray.forEach((data, index) => {
        if (data?.peerID == otherPeerId) {
          streamArray[index].remoteStream =
            videoStreamArray[index].remoteStream;
          myVideo.current.srcObject.getAudioTracks()[0].enabled = true;
          streamArray[index].audio = true;
        }
      });

      setVideoStreamArray(streamArray);
    });

    socket.on("videoOff", (otherPeerId) => {
      console.log(otherPeerId);
      let streamArray = JSON.parse(JSON.stringify(videoStreamArray));
      streamArray.forEach((data, index) => {
        streamArray[index].remoteStream = videoStreamArray[index].remoteStream;
        if (data?.peerID == otherPeerId) {
          streamArray[index].video = false;
          remoteVideo.current[index].style.display = "none";
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
          streamArray[index].video = true;
          remoteVideo.current[index].style.display = "block";
        }
      });
      setVideoStreamArray(streamArray);
    }); 

    socket.on("callEnd", (otherPeerId) => {
      console.log(otherPeerId);
      let streamArray = JSON.parse(JSON.stringify(videoStreamArray));
      streamArray.forEach((data, index) => {
        streamArray[index].remoteStream = videoStreamArray[index].remoteStream;
        if (data?.peerID == otherPeerId) {
          connectionRef.current[index]?.destroy();
          remoteVideo.current[index]?.remove();
          remoteHeader.current?.remove();
          streamArray.splice(index, 1);
          // socket.off();
        }
        console.log(streamArray);
        setVideoStreamArray(streamArray);
      });
    });
  }, [videoStreamArray]);

  useEffect(() => {

    if (videoStreamArray && videoStreamArray.length > 0) {
      videoStreamArray.map((stream, i) => {
        remoteVideo.current[i].srcObject = stream.remoteStream;
      });
    }
  }, [videoStreamArray]);

  const audioONOFF = () => {
    let roomId = roomIdValue;
    let myId = myPeer.id;
    // let myId = peersId;
    if (audioSound) {
      socket.emit("audioOff", { roomId, myId });
      setAudioSound(false);
      // myVideo.current.srcObject.getAudioTracks()[0].enabled = false;
    } else {
      socket.emit("audioOn", { roomId, myId });
      setAudioSound(true);
      // myVideo.current.srcObject.getAudioTracks()[0].enabled = true;
    }
  };

  function videoONOFF() {
    let roomId = roomIdValue;
    let peerId = myPeer.id;
    // console.log("MyPeer", myPeer.id)
    // console.log("OpenPeer", peerId)
    console.log(myVideo);
    if (myVideo.current.srcObject.getVideoTracks()[0].enabled) {
      socket.emit("videoOff", { roomId, peerId });
      myVideo.current.srcObject.getVideoTracks()[0].enabled = false;
      setScreen(false);
      const tracks = myVideo.current.srcObject.getVideoTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    } else {
      socket.emit("videoOn", { roomId, peerId });
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          console.log(myVideo);
          myVideo.current.srcObject = stream;
          let vdoTrack = stream.getVideoTracks()[0];
          setScreen(true);
          peerListAnsArray.map((RTCPeer) => {
            RTCPeer.getSenders()
              .find((data) => {
                return data.track.kind == vdoTrack.kind;
              })
              .replaceTrack(vdoTrack);
          });
        });
    }
  }

  const callEnd = () => {
    let roomId = roomIdValue;
    let peerId = myPeer.id;

    socket.emit("callEnd", { roomId, peerId });
    window.location.reload();
  };

  return (
    <div
      className="container-fluid mt-4 w-100"
      style={{ display: `${streamId ? "block" : "flex"}` }}
    >
      {landingPage ? (
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
          callEnd={callEnd}
          remoteHeader={remoteHeader}
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
