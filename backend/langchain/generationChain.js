import { ChatOpenAI } from "@langchain/openai";
import { retrieveRelevantChunks } from "./vectorStore.js";
import GeneratedDraft from "../models/GeneratedDraft.js";


export async function generateDraft({
  userId,
  type = "leave",
  details = "",
  docId,
  k = 4,
  modelName = "gpt-4o-mini"
}) {
  const contextChunks = docId
    ? await retrieveRelevantChunks({
        userId,
        docId,
        query: `${type} policy rules or company name`,
        k,
      })
    : [];

  const contextText = contextChunks
    .map(
      (c, idx) => `Source ${idx + 1} (p.${c.metadata.pageNumber}):\n${c.text}`
    )
    .join("\n\n");

  const model = new ChatOpenAI({
    temperature: 0.3,
    modelName,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });


  const compliancePrompt = `
You are a strict HR compliance evaluator.

Company Policy Context:
${contextText || "No context available."}

User Request:
Type: ${type}
Details: ${details || "N/A"}

Task:
1. Analyze if this request complies with the company policy.
2. If compliant, reply ONLY with "ALLOWED".
3. If not compliant, reply ONLY with "NOT ALLOWED: <one short reason why it violates policy>".

Examples:
- "NOT ALLOWED: Leave beyond 15 days not permitted as per policy."
- "NOT ALLOWED: Employee must give 30 days notice before resignation."
- If there is no context or unclear policy, still assume short or minor leave (like 1-3 days) is ALLOWED.

Return no other text except one of these two patterns.
`;

  const complianceResponse = await model.invoke([
    { role: "system", content: "You are a policy compliance checker." },
    { role: "user", content: compliancePrompt.trim() },
  ]);

  const complianceText = complianceResponse?.content?.trim() || "";


  let isAllowed = true;

  if (complianceText.startsWith("NOT ALLOWED")) {
    if (complianceText.toLowerCase().includes("no context")) {
      isAllowed = true;
    } else {
      isAllowed = false;
    }
  }

  if (!isAllowed) {
    const draft = await GeneratedDraft.create({
      userId,
      type,
      content: complianceText,
      relatedDocIds: docId ? [docId] : [],
      status: "draft",
    });
    return draft;
  }

  const systemPrompt = `
You are an HR assistant.
Write professional HR documents (leave applications, resignations, etc.)
using only the provided document context when available.
Avoid markdown. Use clear, polite, formal language.
`;

  const draftPrompt = `
Task: Draft a ${type} application.

User details / notes:
${details || "N/A"}

Company policy context:
${contextText || "No specific policy context available."}

Guidelines:
- Use real details from the policy if they exist (e.g. company name, HR contact, notice period, max leave days).
- Do NOT invent data if it's absent. Use placeholders only if missing in both document and user input.
- Ensure tone is formal and compliant.
- Include placeholders like [Date], [Employee Name], [Manager Name] where needed.
- Keep length 150–250 words.
`;

  const draftResponse = await model.invoke([
    { role: "system", content: systemPrompt.trim() },
    { role: "user", content: draftPrompt.trim() },
  ]);

  const content = draftResponse?.content ?? "";

  const draft = await GeneratedDraft.create({
    userId,
    type,
    content,
    relatedDocIds: docId ? [docId] : [],
    status: "draft",
  });

  return draft;
}
