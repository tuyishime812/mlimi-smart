import React from "react";

export default function SidebarUnique() {
  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-white/70 via-green-50 to-green-100 border-r border-white/50 backdrop-blur-lg">
      <div className="p-6 flex flex-col items-start gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <div className="text-lg font-bold text-green-800">Mlimi Smart</div>
            <div className="text-xs text-green-600">AI farming assistant</div>
          </div>
        </div>

        <nav className="flex flex-col w-full gap-2">
          <button className="w-full flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-white/60 transition">
            <span className="bg-green-100 p-2 rounded-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="#319795" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </span>
            <span className="text-sm font-medium text-green-800">Model</span>
          </button>
          <button className="w-full flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-white/60 transition">
            <span className="bg-amber-100 p-2 rounded-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h10M4 17h7" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </span>
            <span className="text-sm font-medium text-amber-800">Analysis</span>
          </button>
          <button className="w-full flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-white/60 transition">
            <span className="bg-orange-100 p-2 rounded-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v20" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </span>
            <span className="text-sm font-medium text-orange-800">Weather</span>
          </button>
        </nav>

        <div className="mt-auto w-full">
          <div className="rounded-xl bg-white/60 p-4 shadow-inner">
            <div className="text-xs text-green-700 font-semibold">Quick actions</div>
            <div className="mt-2 flex flex-col gap-2">
              <button className="w-full text-sm py-2 rounded-md bg-green-600 text-white">Upload image</button>
              <button className="w-full text-sm py-2 rounded-md border border-green-200">Run model</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
