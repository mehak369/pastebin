import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../api";

export default function ViewPaste() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPaste() {
      try {
        const res = await fetch(`${API_BASE}/api/pastes/${id}`);
        if (!res.ok) {
          setError("Paste not found or expired");
          return;
        }
        const data = await res.json();
        setContent(data.content);
      } catch {
        setError("Server error");
      }
    }

    fetchPaste();
  }, [id]);

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <pre className="bg-zinc-800 p-4 rounded text-white whitespace-pre-wrap">
          {content}
        </pre>
      )}
    </div>
  );
}
