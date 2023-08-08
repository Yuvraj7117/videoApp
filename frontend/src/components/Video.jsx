/*eslint-disable*/

import { useEffect, useState, useRef } from "react";
import {
  BsMicMuteFill,
  BsMicFill,
  BsCameraVideo,
  BsCameraVideoOff,
  BsTruckFlatbed,
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
  callEnd,
  remoteHeader,
  currentUserName
}) => {
  useEffect(() => {
    myVideo.current.srcObject = currentStream;
  }, []);


  // const [userName,setUserName] = useState()
  const remoteicon = (name) => {
    if (name) {
      return name.slice(0, 1);
    } else {
      return;
    }
  };

//   useEffect(() => {
//     setUserName(currentName)
//   },[])
//  console.log(userName)
  const currenticon = () => {
    if (currentName[0]) {
      return currentName[0].slice(0, 1);
    } else {
      return;
    }
  };

  return (
    <div className=" container-fluid d-flex ">
      {/* <p ref={statusRef}></p> */}
      <div className={"row w-100"}>
        <div className={`col-3 my-3`}>
          <div className="card ">
            <div className="card-header">
              {currentName ? (
                <span>{`You: ${currentName}`}</span>
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
                  {!screen && (
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
                      {currenticon()}
                    </span>
                  )}

                  <video
                    className="w-100"
                    style={{
                      visibility: `${!screen ? "hidden" : "visible"}`,
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
        {
          videoStreamArray && videoStreamArray.map((videoStream, i) => {
            console.log(videoStream.audio)
            console.log(videoStream.video)
            return (
              <div className="col-3 my-3" key={i}>
                <div className="card" ref={remoteHeader}>
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
                      style={{
                        objectFit: "cover",
                      }}
                    >
                      <video
                        className="w-100"
                        style={{
                          position: "absolute",
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
            !audioSound ? "bg bg-danger" : "bg bg-success"
          }`}
          onClick={() => {
            audioONOFF();
            // toggleAudio();
            // myVideo.current.srcObject.getTracks()[0].enabled =
            //   !myVideo.current.srcObject.getTracks()[0].enabled;
            // audioFun(myVideo.current.srcObject.getTracks()[0].enabled);
          }}
        >
          {!audioSound ? <BsMicMuteFill /> : <BsMicFill />}
        </button>
        <button
          className={`rounded-circle fs-4 ${
            !screen ? "bg bg-danger" : "bg bg-success"
          }`}
          onClick={() => {
            // myVideo.current.srcObject.getTracks()[1].enabled =
            //   !myVideo.current.srcObject.getTracks()[1].enabled
            //  console.log(myVideo.current.srcObject.getTracks()[1])

            // videoFun(myVideo.current.srcObject.getVideoTracks()[0]);
            videoONOFF();
          }}
        >
          {screen ? <BsCameraVideo /> : <BsCameraVideoOff />}
        </button>
        {peerIds && (
          <button
            className={`rounded-circle fs-4 ${"bg bg-danger"}`}
            onClick={() => {
              callEnd();
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
