import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Editor from "@monaco-editor/react";

const sanitizeCode = (code) => {
  if (!code || typeof code !== "string") return code || "";
  let s = code.replace(/^\uFEFF/, "");
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");
  s = s.replace(/^[\x00-\x1F\x7F]+/, "");

  const firstImport = s.search(/^\s*import\b/m);
  if (firstImport !== -1) return s.slice(firstImport);

  const firstExport = s.search(/^\s*export\b/m);
  if (firstExport !== -1) return s.slice(firstExport);

  const firstModule = s.search(/^\s*module\.exports\b/m);
  if (firstModule !== -1) return s.slice(firstModule);

  return s.replace(/^\s+/, "");
};

const HomeScreen = () => {
  const [level, setLevel] = useState("easy");
  const [originalCode, setOriginalCode] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBuggyCode, setLoadingBuggyCode] = useState(false);
  const [panelHeight, setPanelHeight] = useState(250);
  const [resizing, setResizing] = useState(false);

  const fetchBuggyCode = async () => {
    setLoadingBuggyCode(true);
    setResult(null);
    try {
      const res = await fetch(`http://localhost:3001/api/buggy?level=${level}`);
      const data = await res.json();
      const sanitized = sanitizeCode(data.code || "");
      setOriginalCode(sanitized);
      setFixedCode(sanitized);
      setResult(null);
    } catch (err) {
      setResult({ error: "Failed to fetch buggy code" });
    } finally {
      setLoadingBuggyCode(false);
    }
  };

  const submitFix = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:3001/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, originalCode, fixedCode }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const startResize = (e) => {
    setResizing(true);
    e.preventDefault();
  };

  const stopResize = () => setResizing(false);

  const resizePanel = (e) => {
    if (resizing) {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < window.innerHeight - 100) {
        setPanelHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resizePanel);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", resizePanel);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [resizing]);

  return (
    <Sidebar>
      <div className="h-screen flex flex-col bg-[#1e1e1e] text-gray-200 relative overflow-hidden">
        {/* Pirate Ship Floating GIF */}
        <div className="absolute inset-0 bg-[#1e1e1e] flex flex-col items-center justify-center ">
          <img
            src="/assets/gifs/zoro-run.gif"
            alt="Pirate Ship"
            className="w-48 h-48 animate-bounce opacity-80 mb-6"
          />
          <p className="mt-4 text-xl text-yellow-400 font-bold text-center px-4">
            Are you waiting for Zoro to get lost again… or just click “Load Buggy Code”? 😎💨
          </p>
        </div>

        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700 z-10">
          <h1 className="text-xl font-bold text-blue-400">Debugging Arena 🐞</h1>
          <div className="flex items-center gap-4">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-[#333] text-gray-200 px-2 py-1 rounded hover:bg-indigo-600 transition-colors"
            >
              <option value="easy">Easy 🟢</option>
              <option value="medium">Medium 🟠</option>
              <option value="hard">Hard 🔴</option>
            </select>

            <button
              onClick={fetchBuggyCode}
              disabled={loadingBuggyCode}
              className={`px-3 py-1 rounded text-white text-sm transition-all transform hover:scale-105 ${
                loadingBuggyCode
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingBuggyCode ? "Loading..." : "Load Buggy Code"}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        {originalCode && (
          <div className="bg-[#252526] border-t border-gray-700 p-3 flex justify-between items-center z-10">
            <button
              onClick={submitFix}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white text-sm disabled:opacity-50 transition-all transform hover:scale-105"
            >
              {loading ? "Checking..." : "Submit Fix"}
            </button>
          </div>
        )}

        {/* Editor */}
        {originalCode && (
          <div className="flex-1 grid grid-cols-2 border-t border-gray-700 z-10 relative">
            {/* Original */}
            <div className="flex flex-col border-r border-gray-700">
              <div className="bg-[#252526] px-3 py-1 text-sm border-b border-gray-700">
                original.js
              </div>
              <Editor
                height="100%"
                language="javascript"
                value={originalCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "Fira Code, monospace",
                  lineNumbers: "on",
                  wordWrap: "on",
                  scrollbar: { vertical: "auto" },
                }}
              />
            </div>

            {/* Fixed */}
            <div className="flex flex-col">
              <div className="bg-[#252526] px-3 py-1 text-sm border-b border-gray-700">
                fixed.js
              </div>
              <Editor
                height="100%"
                language="javascript"
                value={fixedCode}
                onChange={(value) => setFixedCode(value)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "Fira Code, monospace",
                  lineNumbers: "on",
                  wordWrap: "on",
                  scrollbar: { vertical: "auto" },
                }}
              />
            </div>
          </div>
        )}

        {/* AI Feedback Panel */}
        {result && (
          <div
            className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-gray-700 shadow-lg z-10"
            style={{ height: panelHeight }}
          >
            <div
              className="h-2 cursor-ns-resize bg-gray-700 hover:bg-gray-600 active:bg-gray-500"
              onMouseDown={startResize}
            />
            <div className="p-4 h-full overflow-y-auto text-sm text-gray-300">
              <h2 className="text-blue-400 font-bold text-lg mb-3">⚡ AI Feedback</h2>

              {result?.error || result?.parsed?.error ? (
                <p className="text-red-400 font-semibold">
                  💥{" "}
                  <span className="bg-yellow-600 text-black px-1 rounded">
                    Whitebeard
                  </span>{" "}
                  is alive again: {result.error || result.parsed.error}
                </p>
              ) : (
                <div className="space-y-4">
                  {"bugFixed" in result.parsed && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-yellow-400">Bug Fixed:</span>
                      {result.parsed.bugFixed ? (
                        <span className="bg-green-700 text-green-200 px-2 py-0.5 rounded text-xs font-semibold">
                          ✅ Yes
                        </span>
                      ) : (
                        <span className="bg-red-700 text-red-200 px-2 py-0.5 rounded text-xs font-semibold">
                          ❌ No
                        </span>
                      )}
                    </div>
                  )}

                  {"explanation" in result.parsed && (
                    <div>
                      <p className="font-bold text-yellow-400 mb-1">Explanation:</p>
                      <div className="bg-[#252526] p-3 rounded text-gray-200 leading-relaxed">
                        {result.parsed.explanation}
                      </div>
                    </div>
                  )}

                  {Array.isArray(result.parsed.suggestions) &&
                    result.parsed.suggestions.length > 0 && (
                      <div>
                        <p className="font-bold text-yellow-400 mb-1">Suggestions:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          {result.parsed.suggestions.map((s, i) => (
                            <li
                              key={i}
                              className="bg-[#252526] px-2 py-1 rounded text-gray-200"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {"insult" in result.parsed && (
                    <p className="text-pink-500 font-extrabold text-2xl mt-4 p-2 rounded bg-gray-800 border-l-4 border-pink-500">
                      💀 {result.parsed.insult}
                    </p>
                  )}

                  {result.parsed.raw && (
                    <div>
                      <p className="font-bold text-yellow-400 mb-1">Raw Response:</p>
                      <pre className="p-3 rounded text-xs overflow-x-auto bg-gray-800 text-gray-200">
                        {result.parsed.raw}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default HomeScreen;
