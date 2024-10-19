import React, { useRef, useState } from "react";
import {
  VideoCameraIcon,
  StopCircleIcon,
  PlayIcon,
} from "@heroicons/react/16/solid";
import VideoModal from "./VideoModal";

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrors("getUserMedia is not supported");
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          const chunks: Blob[] = [];
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            //Todo: save the video to the "server"
            setVideoURL(url);
          };
          mediaRecorder.start();
          setRecording(true);
          setErrors(null);
        })
        .catch((err) => {
          if (err.name === "NotAllowedError") {
            setErrors(
              "Camera access is denied, please enable it and try again."
            );
          } else {
            if (err.message) {
              setErrors(`Error accessing camera with err: ${err.message}`);
            } else {
              setErrors("Error accessing camera");
            }
          }
        });
    }
  };

  //To do: implement the logic to save the video to the server, should be async
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  const fullWidthCentered = "w-full max-w-xl mx-auto";
  const videoStyle = `bg-white box-border border-2 border-slate-100 aspect-[4/3] ${fullWidthCentered}`;
  const buttonStyle =
    "text-white rounded-lg mt-4 px-5 py-2.5 me-2 text-center inline-flex items-center";

  return (
    <div className={fullWidthCentered}>
      <div>
        <video ref={videoRef} className={videoStyle} />
        <div className="flex justify-between items-center space-x-4">
          {recording ? (
            <button
              onClick={stopRecording}
              type="button"
              className={`${buttonStyle} bg-red-500 hover:bg-red-600`}
            >
              <StopCircleIcon className="w-5 h-5 me-1" />
              Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              type="button"
              className={`${buttonStyle} bg-emerald-500 hover:bg-emerald-600`}
            >
              <VideoCameraIcon className="w-5 h-5 me-1" />
              Start Recording
            </button>
          )}
          {videoURL && (
            <button
              onClick={() => setShowModal(true)}
              type="button"
              className={`${buttonStyle} bg-slate-100 hover:bg-slate-200 text-slate-900`}
            >
              <PlayIcon className="w-5 h-5 me-1" />
              Play Recorded Video
            </button>
          )}
        </div>
      </div>

      {errors && <div className="text-red-700">{errors}</div>}
      <div className={fullWidthCentered}>
        <VideoModal
          showModal={showModal}
          videoUrl={videoURL || ""}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default VideoRecorder;
