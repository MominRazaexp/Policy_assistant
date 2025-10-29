import { useEffect, useState } from "react";
import { getHistory } from "../utils/api";

export default function HistoryList({ userId, onSelectDoc }) {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    if (!userId) return;
    getHistory(userId).then(setHistory).catch(console.error);
  }, [userId]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">History</h2>
      {!history && <p className="text-sm text-gray-600">No history yet.</p>}
      {history && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Documents</h3>
            <ul className="space-y-1">
              {history.documents?.map((d) => (
                <li key={d._id} className="flex items-center justify-between text-sm">
                  <span>
                    {d.originalName} <span className="text-gray-500">({d.status}, {d.pages} pages)</span>
                  </span>
                  <button className="text-blue-600" onClick={() => onSelectDoc(d)}>Select</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-1">Drafts</h3>
            <ul className="space-y-1 text-sm">
              {history.drafts?.map((dr) => (
                <li key={dr._id}>
                  [{dr.type}] {new Date(dr.createdAt).toLocaleString()} - <span className="text-gray-600">{dr.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-1">Actions</h3>
            <ul className="space-y-1 text-sm">
              {history.actions?.map((a) => (
                <li key={a._id}>
                  {a.actionType.toUpperCase()} to {a.target} - {new Date(a.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}