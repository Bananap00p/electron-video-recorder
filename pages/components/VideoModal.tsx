import React from "react";

interface VideoModalProps {
  showModal: boolean;
  videoUrl: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({
  showModal,
  videoUrl,
  onClose,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-white rounded-lg p-3">
        <video
          className="bg-white box-border border-2 border-slate-100 aspect-[4/3] w-full max-w-xl mx-auto"
          src={videoUrl}
          controls
          title="Recorded Electron Video"
        ></video>
        <button
          className="text-white bg-red-500 hover:bg-red-600 rounded-lg mt-4 px-5 py-2.5 me-2 text-center inline-flex items-center"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VideoModal;
