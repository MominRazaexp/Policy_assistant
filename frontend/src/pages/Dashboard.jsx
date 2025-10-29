import FileUploader from "../components/FileUploader";
import ChatBox from "../components/ChatBox";
import GeneratorForm from "../components/GeneratorForm";
import HistoryList from "../components/HistoryList";
import { useState } from "react";

export default function Dashboard() {
  const [userId, setUserId] = useState("demo-user-1");
  const [activeDoc, setActiveDoc] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-4 rounded shadow">
          <label className="block text-sm font-medium mb-2">User ID</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <FileUploader userId={userId} onIngested={(doc) => setActiveDoc(doc)} />
        <HistoryList userId={userId} onSelectDoc={setActiveDoc} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <ChatBox userId={userId} docId={activeDoc?._id} />
        <GeneratorForm userId={userId} docId={activeDoc?._id} />
      </div>
    </div>
  );
}