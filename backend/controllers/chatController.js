import ChatSession from "../models/ChatSession.js";
import { askQuestion } from "../langchain/chatChain.js";
import { generalChat } from "../langchain/generalChat.js";

export const chatAsk = async (req, res) => {
  const { userId, query, docId } = req.body;
  if (!userId || !query) {
    return res
      .status(400)
      .json({ status: "error", message: "userId and query are required" });
  }

  let session = await ChatSession.findOne({ userId });
  if (!session) session = await ChatSession.create({ userId, messages: [] });

  const lowerQuery = query.toLowerCase();

  const isGeneralChat =
    /(hello|hi|hey|salam|who are you|my name is|good morning|good evening|what i have asked|last question)/i.test(
      lowerQuery
    );

  let answer = "";
  let citations = [];

  try {
    if (isGeneralChat) {
      const response = await generalChat({ session, query });
      answer = response.answer;
    } else {
      const result = await askQuestion({ userId, query, docId, session });
      answer = result.answer;
      citations = result.citations || [];
    }

    session.messages.push({ role: "user", content: query });
    session.messages.push({ role: "assistant", content: answer, citations });
    await session.save();

    res.json({ status: "ok", answer, citations });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
