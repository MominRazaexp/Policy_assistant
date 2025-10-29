import { useState } from "react";
import { askChat } from "../utils/api";

export default function ChatBox({ userId, docId }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!query) return;
    setLoading(true);
    setAnswer("");
    setCitations([]);
    try {
      const res = await askChat({ userId, query, docId });
      setAnswer(res.answer);
      setCitations(res.citations || []);
    } catch (e) {
      setAnswer(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Chat about the Policy</h2>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask a question about the document..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          onClick={ask}
          disabled={loading || !query}
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>
      {answer && (
        <div className="mt-4">
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}