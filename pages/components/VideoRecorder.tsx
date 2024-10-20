import React, { useRef, useState } from "react";

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [errors, setErrors] = useState<string | null>(null);

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
            // Handle user denying camera access
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div>
        <video
          ref={videoRef}
          className="box-border border-4 border-black w-full max-w-3xl mx-auto"
        />
        <div>
          {recording ? (
            <button onClick={stopRecording}>Stop Recording</button>
          ) : (
            <button onClick={startRecording}>Start Recording</button>
          )}
        </div>
      </div>

      {/* Todo: display play button that plays the recorded video in modal */}
      {videoURL && (
        <div>
          <h3>Recorded Video:</h3>
          <video
            src={videoURL}
            controls
            className="box-border border-4 border-black w-full max-w-3xl mx-auto"
          />
        </div>
      )}
      {errors && <div className="text-red-700">{errors}</div>}
    </div>
  );
};

export default VideoRecorder;
