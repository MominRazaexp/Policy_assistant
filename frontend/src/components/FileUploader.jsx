import { useState } from "react";
import { uploadPDF, ingestDoc } from "../utils/api";

export default function FileUploader({ userId, onIngested }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setLog("Uploading...");
    try {
      const up = await uploadPDF({ userId, file });
      setLog("Uploaded. Ingesting...");
      const ing = await ingestDoc({ userId, docId: up.document._id });
      setLog(`Ingested ${ing.ingestedChunks} chunks from ${ing.pages} pages.`);
      onIngested && onIngested(up.document);
    } catch (e) {
      console.error(e);
      setLog(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Upload Policy PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleUpload}
        disabled={loading || !file}
      >
        {loading ? "Processing..." : "Upload & Ingest"}
      </button>
      {log && <p className="mt-2 text-sm text-gray-600">{log}</p>}
    </div>
  );
}