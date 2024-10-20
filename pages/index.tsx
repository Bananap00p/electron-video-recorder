import React from "react";
//import Image from "next/image";
import VideoRecorder from "./components/VideoRecorder";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        <h1 className="text-4xl font-bold uppercase text-center">
          Electron Video Recorder
        </h1>
        <div className="w-full">
          <VideoRecorder />
        </div>
      </main>
    </div>
  );
}
