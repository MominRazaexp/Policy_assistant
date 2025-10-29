import { ChatOpenAI } from "@langchain/openai";

export async function generalChat({ session, query }) {
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.6,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const history = session.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));


  const nameMatch = query.match(/my name is\s+([a-zA-Z ]+)/i);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    session.userName = name;
    await session.save();
  }

  const systemPrompt = `
You are a friendly AI assistant that remembers past messages and user name.
Rules:
- If user says hello or asks who you are, greet them naturally.
- If they tell you their name, remember it and use it in future replies.
- If they ask "what was my last question", recall their most recent user query from memory.
- Always keep tone friendly and human-like.
- If user asks about company policies, say you'll check the document for details.
`;

  const messages = [
    { role: "system", content: systemPrompt.trim() },
    ...(session.userName
      ? [
          {
            role: "system",
            content: `User's name is ${session.userName}. Address them by name when replying.`,
          },
        ]
      : []),
    ...history,
    { role: "user", content: query },
  ];

  const response = await model.invoke(messages);

  return { answer: response?.content ?? "" };
}
