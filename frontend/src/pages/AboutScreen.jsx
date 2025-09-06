import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";


const AboutScreen = () => {


  return (
    <Sidebar>
      <div className="h-screen flex flex-col bg-[#1e1e1e] text-gray-200 p-6 relative overflow-x-hidden">
        {/* Pirate Ship GIF */}
        <div className="flex justify-center mb-6 z-10 relative">
          <img
            src="/assets/gifs/dance.gif"
            alt="Pirate Ship"
            className="w-64 h-64 object-cover rounded-lg shadow-lg animate-bounce"
          />
          
        </div>

        <h1 className="text-3xl font-extrabold text-yellow-400 mb-4 z-10 relative">
          🏴‍☠️ About Debugging Arena
        </h1>

        <p className="text-lg mb-4 leading-relaxed z-10 relative">
          Welcome to <span className="text-blue-400 font-bold">Debugging Arena</span>, the pirate-infested waters
          where only the sharpest coders survive! 🐙💻
        </p>

        <div className="bg-[#252526] rounded-lg p-4 mb-4 shadow-md border-l-4 border-yellow-400 z-10 relative">
          <p className="font-bold text-yellow-300 mb-2">
            ⚡ What is this place?
          </p>
          <p>
            Here, buggy code is like the Grand Line — treacherous and full of traps. Your mission: fix it before the sea swallows you. If you fail, Zoro will facepalm, and Luffy might eat your computer. 🍖💀
          </p>
        </div>

        <div className="bg-[#252526] rounded-lg p-4 mb-4 shadow-md border-l-4 border-pink-500 z-10 relative">
          <p className="font-bold text-pink-400 mb-2">💥 Why One Piece theme?</p>
          <p>
            Because code is like treasure — some find it quickly, others wander lost like Sanji searching for his heart. Expect funny insults if you mess up — even Whitebeard would shake his head. 😎
          </p>
        </div>

        <div className="bg-[#252526] rounded-lg p-4 mb-4 shadow-md border-l-4 border-green-400 z-10 relative">
          <p className="font-bold text-green-300 mb-2">🧭 How to survive?</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Read the bug carefully — don’t let it bite you like Buggy the Clown!</li>
            <li>Think like Zoro: every loop and conditional has a path to master.</li>
            <li>Learn from failures — Luffy didn’t become Pirate King overnight.</li>
            <li>Submit fixes bravely and watch AI give you hilariously honest feedback.</li>
          </ul>
        </div>

        <div className="bg-[#252526] rounded-lg p-4 shadow-md border-l-4 border-blue-400 mt-auto z-10 relative">
          <p className="font-bold text-blue-300 mb-2">🎉 Credits</p>
          <p>
            Made by coders who survived the Grand Line of bugs. Special thanks to the One Piece crew for inspiring insults, motivation, and epic adventures.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Warning: no real pirates were harmed in the making of this app. ☠️
          </p>
        </div>

      </div>
    </Sidebar>
  );
};

export default AboutScreen;
