/*eslint-disable*/

import { useEffect, useState, useRef } from "react";
import {
  BsMicMuteFill,
  BsMicFill,
  BsCameraVideo,
  BsCameraVideoOff,
  // BsTruckFlatbed,
} from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";
const Video = ({
  peerIds,
  audioSound,
  screen,
  videoStreamArray,
  currentName,
  currentStream,
  remoteVideo,
  audioONOFF,
  videoONOFF,
  myVideo,
  callEndFun,
  remoteHeader,
  currentUserName,
  streamVideo,
  socket,
  myPeer,
  setVideoStreamArray,
  peers,
  setPeers,
  setPeerListAnsArray,
  connectionRef,
  toggleAudVid,
  peerInfo,
  info,
  currentPeerConnection,
}) => {
  useEffect(() => {
    // console.log(streamVideo)
    myVideo.current.srcObject = streamVideo;

    socket.on("joined", (data) => {
      const { peerId, name, roomId, video, audio } = data;
      console.log(peerId);
      // setFirstUser(name);
      // setOtherName([...otherName, name]);

      // setPeersId(peerId);
      console.log(streamVideo);
      const call = myPeer.call(peerId, streamVideo, {
        metadata: { userName: info.name, audio: audio, video: video },
      });

      currentPeerConnection.current.push(call.peerConnection);

      let peersList = JSON.parse(JSON.stringify(peers));
      call.on("stream", (remoteStream) => {
        console.log(remoteStream);
        if (!peersList.includes(peerId)) {
          peersList.push(peerId);
          setPeers(peersList);

          // setStreamId(remoteStream.id);
          // setRoom(call.id);
          setVideoStreamArray((prev) => [
            ...prev,
            { remoteStream, name, audio, video, peerID: peerId },
          ]);
          // setNameArr((prev) => [...prev, call.metadata.userName]);
          connectionRef.current = myPeer;
        }
      });

      // getStreamRef.current = streamVideo;
      // socket.emit("stopVideo", { peerId, roomId})
    });

    myPeer.on("call", (call) => {
      call.answer(streamVideo);
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
          // setNameArr((prev) => [...prev, call.metadata.userName]);
          connectionRef.current = myPeer;
                currentPeerConnection.current.push(call.peerConnection);

          //  console.log(remoteStream);
        }
      });
    });
  }, [streamVideo]);

  // const [userName,setUserName] = useState()
  const remoteicon = (name) => {
    if (name) {
      return name.slice(0, 1);
    } else {
      return;
    }
  };

  const currenticon = (name) => {
    if (name) {
      return name.slice(0, 1);
    } else {
      return;
    }
  };

  console.log(videoStreamArray);
  return (
    <div className=" container-fluid d-flex ">
      {/* <p ref={statusRef}></p> */}
      <div className={"row w-100"}>
        <div className={`col-3 my-3`}>
          <div className="card ">
            <div className="card-header">
              {peerInfo.name ? (
                <span>{`You: ${peerInfo.name}`}</span>
              ) : (
                <span>You:</span>
              )}
            </div>
            <div className="card-body p-0 m-0 w-100">
              {
                <div
                  style={{
                    objectFit: "cover",
                    padding: "0px",
                  }}
                >
                  {!toggleAudVid.video && (
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "grey",
                        margin: "30px",
                        marginLeft: "70px",
                        borderRadius: "20vw",
                        fontSize: "10vw",
                        width: "12vw",
                        height: "10vw",
                        color: "white",
                      }}
                    >
                      {currenticon(peerInfo.name)}
                    </span>
                  )}

                  <video
                    className="w-100"
                    style={{
                      display: `${!toggleAudVid.video ? "none" : "block"}`,
                      position: "absolute",
                    }}
                    ref={myVideo}
                    muted
                    autoPlay
                  ></video>
                </div>
              }
            </div>
          </div>
        </div>
        {videoStreamArray &&
          videoStreamArray.map((videoStream, i) => {
            return (
              <div className="col-3 my-3" key={i}>
                <div
                  className="card"
                  ref={
                    remoteHeader
                    // (element) => {
                    // remoteHeader.current[i] = element;
                    // }
                  }
                >
                  <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{videoStream.name}</span>
                      {!videoStream?.audio ? (
                        <BsMicMuteFill className="text-danger" />
                      ) : (
                        <BsMicFill className="text-success" />
                      )}
                    </div>
                  </div>
                  <div className="card-body m-0 p-0 w-100">
                    {!videoStream.video && (
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "grey",
                          margin: "30px",
                          marginLeft: "70px",
                          borderRadius: "20vw",
                          fontSize: "10vw",
                          width: "12vw",
                          height: "10vw",
                          color: "white",
                        }}
                      >
                        {remoteicon(videoStream.name)}
                      </span>
                    )}
                    <div
                    // style={{
                    //   objectFit: "cover",
                    // }}
                    >
                      <video
                        className="w-100"
                        style={{
                          display: `${!videoStream.video ? "none" : "block"}`,
                          // position: "absolute",
                        }}
                        // id="videoElem"
                        ref={(element) => {
                          remoteVideo.current[i] = element;
                        }}
                        autoPlay
                      ></video>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {/* <div className="row mx-2">
        
      </div> */}
      <div
        style={{
          position: "fixed",
          top: "90vh",
          marginLeft: "35vw",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "30vw",
          zIndex: 2,
        }}
      >
        <button
          className={`rounded-circle fs-4 ${
            !toggleAudVid.audio ? "bg bg-danger" : "bg bg-success"
          }`}
          onClick={() => {
            audioONOFF();
            // toggleAudio();
            // myVideo.current.srcObject.getTracks()[0].enabled =
            //   !myVideo.current.srcObject.getTracks()[0].enabled;
            // audioFun(myVideo.current.srcObject.getTracks()[0].enabled);
          }}
        >
          {!toggleAudVid.audio ? <BsMicMuteFill /> : <BsMicFill />}
        </button>
        <button
          className={`rounded-circle fs-4 ${
            !toggleAudVid.video ? "bg bg-danger" : "bg bg-success"
          }`}
          onClick={() => {
            // myVideo.current.srcObject.getTracks()[1].enabled =
            //   !myVideo.current.srcObject.getTracks()[1].enabled
            //  console.log(myVideo.current.srcObject.getTracks()[1])

            // videoFun(myVideo.current.srcObject.getVideoTracks()[0]);
            videoONOFF();
          }}
        >
          {toggleAudVid.video ? <BsCameraVideo /> : <BsCameraVideoOff />}
        </button>
        {peerIds && (
          <button
            className={`rounded-circle fs-4 ${"bg bg-danger"}`}
            onClick={() => {
              callEndFun();
            }}
          >
            {peerIds && <MdCallEnd />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Video;
