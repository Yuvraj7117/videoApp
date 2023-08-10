/*eslint-disable*/

import { useEffect, useRef } from "react";
// import { useSelector,useDispatch} from "react-redux";
import {
  BsMicMuteFill,
  BsMicFill,
  BsCameraVideo,
  BsCameraVideoOff,
  // BsTruckFlatbed,
} from "react-icons/bs";

import { audioOn, audioOff, videoOff, videoOn,callEnd } from '../redux/toggleSlice'
const RoomJoin = ({
  info,
  setInfo,
  peerIdNo,
  screen,
  setScreen,
  audioSound,
  setAudioSound,
  streamId,
  myVideo,
  joinToRoom,
  initialVideo,
  toggleAudVid,
  dispatch
}) => {
  //  const dispatch = useDispatch()
  // const toggleAudVid = useSelector((state) => state.toggleSlice);
  
 function videoONOFF() {
   if (initialVideo.current.srcObject.getVideoTracks()[0].enabled) {
     initialVideo.current.srcObject.getVideoTracks()[0].enabled = false;
     dispatch(videoOff({ status: false }));

    initialVideo.current.srcObject.getTracks().forEach((tracks) => {
      tracks.stop();
    });
   } else {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          // console.log(myVideo);
          initialVideo.current.srcObject = stream;
        });
        dispatch(videoOn({ status: true }));
        // initialVideo.current.srcObject.getVideoTracks()[0].enabled = true;
   }
 }

 const audioONOFF = () => {
   if (toggleAudVid.audio) {
   initialVideo.current.srcObject.getAudioTracks()[0].enabled=false;
     dispatch(audioOff({status:false}))
   } else {
   initialVideo.current.srcObject.getAudioTracks()[0].enabled = true;
      dispatch(audioOn({status:true}));
   }
 };


  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        initialVideo.current.srcObject = stream;
      });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  
 
  return (
    <div>
      <div className=" d-flex justify-content-center ">
        <h1 style={{ marginLeft: "30vw" }}>Live Video App</h1>
      </div>
      <div className="d-flex">
        <div className={streamId ? "row w-25" : "row  col"}>
          <div className={streamId ? "col-12  " : "col"}>
            <div className="card">
              <video ref={initialVideo} muted autoPlay></video>
            </div>
          </div>

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
                !toggleAudVid.video? "bg bg-danger" : "bg bg-success"
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
          </div>
        </div>
        {!streamId && (
          <div style={{ margin: "20%" }}>
            <h5
              style={{
                display: "flex",
                justifyContent: "center",
                marginBlock: "15px",
                color: "blue",
              }}
            >
              Join in A Room
            </h5>
            <div
              className=" "
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <input
                className="text-success "
                name="name"
                value={info.name}
                placeholder="Enter You Name"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              <br />

              <input
                className="text-success"
                name="roomId"
                value={info.roomId}
                placeholder="Enter Room Id"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              {info.name && info.roomId ? (
                <button
                  className="btn btn-outline-primary"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                  onClick={() => {
                    joinToRoom(peerIdNo, info);
                  }}
                >
                  Join Room
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

//  RoomJoin.propTypes = { info, setInfo ,socket, peerId,setMetaData :PropTypes.Object.isRequired,}

export default RoomJoin