import React from "react";

const NotFound = () => {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-3xl">
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          Are you Zoro?
        </h1>
        <p className="mt-6 text-lg font-medium text-gray-400 sm:text-xl">
          Cause you have found One Piece. Sishh that was fast!
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-y-6">
          <a
            href="/"
            className="rounded-md bg-indigo-500 px-5 py-3 text-lg font-semibold text-white shadow-md hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Go back home
          </a>

          {/* Bigger responsive GIF */}
          <img
            src="/assets/gifs/zoro-lost.gif"
            alt="Zoro Lost"
            className="w-full max-w-2xl rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
