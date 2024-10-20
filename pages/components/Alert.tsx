import React from "react";

interface AlertProps {
  errorMsg: string;
}

const Alert: React.FC<AlertProps> = ({ errorMsg }) => {
  return (
    <div role="alert" className="w-full pt-4">
      <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
        Error
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>
          {errorMsg ? errorMsg : "There was an error recording your video."}
        </p>
      </div>
    </div>
  );
};

export default Alert;
