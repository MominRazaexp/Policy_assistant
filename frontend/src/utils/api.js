const API_BASE_URL = "http://localhost:5000" || import.meta.env.VITE_API_BASE_URL;

async function http(method, path, { body, isForm } = {}) {
  const opts = { method, headers: {} };
  if (isForm) {
    opts.body = body;
  } else if (body) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok || data.status === "error") {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

export async function uploadPDF({ userId, file }) {
  const form = new FormData();
  form.append("userId", userId);
  form.append("file", file);
  const data = await http("POST", "/api/upload", { body: form, isForm: true });
  return data;
}

export async function ingestDoc({ userId, docId }) {
  const data = await http("POST", "/api/ingest", { body: { userId, docId } });
  return data;
}

export async function askChat({ userId, query, docId }) {
  const data = await http("POST", "/api/chat", { body: { userId, query, docId } });
  return data;
}

export async function generateDraft({ userId, type, details, docId }) {
  const data = await http("POST", "/api/generate", { body: { userId, type, details, docId } });
  return data;
}

export async function sendSlack({ text, draftId, channel }) {
  const data = await http("POST", "/api/slack/send", { body: { text, draftId, channel } });
  return data;
}

export async function sendEmail({ userId, to, subject, text, draftId }) {
  const data = await http("POST", "/api/email/send", { body: { userId, to, subject, text, draftId } });
  return data;
}

export async function getHistory(userId) {
  const data = await http("GET", `/api/history/${userId}`);
  return data.data;
}