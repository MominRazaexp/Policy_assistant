import { ChatOpenAI } from "@langchain/openai";
import { retrieveRelevantChunks } from "./vectorStore.js";

// If you ever want to use LangChain’s memory:
// import { BufferMemory } from "langchain/memory";
// import { ChatMessageHistory } from "langchain/stores/message/in_memory";

export async function askQuestion({
  userId,
  query,
  docId,
  modelName = "gpt-4o-mini",
  session,
}) {
  const contextChunks = await retrieveRelevantChunks({ userId, docId, query });

  const contextText = contextChunks
    .map(
      (c, idx) => `Source ${idx + 1} (p.${c.metadata.pageNumber}):\n${c.text}`
    )
    .join("\n\n");

  const citations = contextChunks.map((c, idx) => ({
    source: idx + 1,
    pageNumber: c.metadata.pageNumber,
    chunkIndex: c.metadata.chunkIndex,
  }));

  const systemInstruction = `
You are a compliance assistant with memory of past user interactions.
You must:
- Use the previous conversation to maintain context.
- If the user asks “what was my last question” or similar, recall it from memory.
- If the user has shared their name, address them by it.
- When answering about policies, rely strictly on the provided sources.
- If information is missing in sources, say you don’t have enough information.
`;

  const historyMessages = session.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const userPrompt = `
User question:
${query}

Relevant policy document sources:
${contextText}

Return the answer first. At the end, add a "Citations" line listing relevant page numbers, e.g., "Citations: p.3, p.7".
`;

  const model = new ChatOpenAI({
    temperature: 0.2,
    modelName,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  /*
  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(),
    returnMessages: true,
    memoryKey: "chat_history", // optional
  });

  // Load past messages into BufferMemory manually
  for (const msg of session.messages) {
    if (msg.role === "user") {
      await memory.chatHistory.addUserMessage(msg.content);
    } else {
      await memory.chatHistory.addAIMessage(msg.content);
    }
  }

  // When you invoke the model, you could later read memory like this:
  const pastMessages = await memory.chatHistory.getMessages();
  */

  const messages = [
    { role: "system", content: systemInstruction.trim() },
    ...(session.userName
      ? [
          {
            role: "system",
            content: `User's name is ${session.userName}. Address them by their name when speaking.`,
          },
        ]
      : []),
    ...historyMessages,
    { role: "user", content: userPrompt.trim() },
  ];

  const response = await model.invoke(messages);

  return {
    answer: response?.content ?? "",
    citations,
  };
}
