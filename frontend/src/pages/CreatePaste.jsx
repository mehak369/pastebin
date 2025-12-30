import { useState } from "react";
import { API_BASE } from "../api";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResultUrl("");

    const payload = {
      content
    };

    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    try {
      const res = await fetch(`${API_BASE}/api/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch {
      setError("Server not reachable");
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-400 items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-zinc-800 p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-white text-2xl font-semibold mb-4">Pastebin Lite</h1>

        <textarea
          className="w-full text-white h-40 bg-zinc-900 border border-zinc-700 rounded p-3 mb-4 focus:outline-none"
          placeholder="Enter your paste content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="flex gap-3 mb-4">
          <input
            type="number"
            placeholder="TTL (seconds)"
            className="flex-1 text-white bg-zinc-900 border border-zinc-700 rounded p-2"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max views"
            className="flex-1 text-white bg-zinc-900 border border-zinc-700 rounded p-2"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </div>

        <button
          className="w-full text-white bg-indigo-600 hover:bg-indigo-500 transition rounded py-2 font-medium"
        >
          Create Paste
        </button>

        {error && (
          <p className="text-red-400 mt-4">{error}</p>
        )}

        {resultUrl && (
          <div className="mt-4">
            <p className="text-green-400 mb-1">Paste created:</p>
            <a
              href={resultUrl}
              target="_blank"
              className="text-indigo-400 underline break-all"
            >
              {resultUrl}
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
