import { useState } from "react";
import { generateDraft, sendSlack, sendEmail } from "../utils/api";

export default function GeneratorForm({ userId, docId }) {
  const [type, setType] = useState("leave");
  const [details, setDetails] = useState("");
  const [draft, setDraft] = useState(null);
  const [slackMessage, setSlackMessage] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("social");

  const handleGenerate = async () => {
    setStatus("Generating...");
    try {
      const res = await generateDraft({ userId, type, details, docId });
      setDraft(res.draft);
      setSlackMessage(res.draft.content);
      setSubject(`${type[0].toUpperCase() + type.slice(1)} Application`);
      setStatus("Draft generated.");
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleSendSlack = async () => {
    if (!slackMessage) return;
    setStatus(`Sending to #${selectedChannel}...`);
    try {
      await sendSlack({ text: slackMessage, draftId: draft._id, channel: selectedChannel });
      setStatus(`Sent to #${selectedChannel}`);
      setDraft({ ...draft, status: "sent_slack" });
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleSendEmail = async () => {
    if (!draft || !toEmail || !subject) return;
    setStatus("Sending Email...");
    try {
      await sendEmail({ userId, to: toEmail, subject, text: draft.content, draftId: draft._id });
      setStatus("Email sent.");
      setDraft({ ...draft, status: "sent_email" });
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto mt-8 border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        📄 Generate Document
      </h2>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="leave">Leave Application</option>
            <option value="resignation">Resignation Letter</option>
            <option value="custom">Custom Request</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Details / Notes</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all resize-none"
            rows="3"
            placeholder="Dates, reason, manager name, etc."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all font-semibold"
          onClick={handleGenerate}
        >
          Generate Draft
        </button>
      </div>

      {/* Draft Preview */}
      {draft && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Preview & Edit</h3>

          <textarea
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 resize-none transition-all"
            style={{ minHeight: "200px", maxHeight: "350px", overflowY: "auto" }}
            value={slackMessage}
            onChange={(e) => setSlackMessage(e.target.value)}
          />

          {/* Slack Section */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              💬 Send to Slack
            </h4>

            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
              >
                <option value="social">#social</option>
                <option value="new-channel">#new-channel</option>
                <option value="momin_hr">#momin_hr</option>
              </select>

              <button
                className="flex-1 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                onClick={handleSendSlack}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Send to Slack
              </button>
            </div>
          </div>

          {/* Email Section */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              ✉️ Send via Email
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
                placeholder="Recipient Email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <button
                className="md:col-span-2 px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg transition-all"
                onClick={handleSendEmail}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {status && (
        <p className="mt-6 text-center text-sm text-gray-600 italic">{status}</p>
      )}
    </div>
  );
}
