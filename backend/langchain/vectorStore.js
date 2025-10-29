import PolicyChunk from "../models/PolicyChunk.js";
import { OpenAIEmbeddings } from "@langchain/openai";

/**
 * Embed a batch of texts using OpenAI embeddings
 */
export async function embedBatch(texts) {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large"
  });
  const vectors = await embeddings.embedDocuments(texts);
  return vectors;
  // [0.123, -0.045, 0.782, ...]
}

export async function storeChunksWithEmbeddings({ userId, docId, chunks }) {
  const vectors = await embedBatch(chunks.map((c) => c.text));
  const docs = chunks.map((c, idx) => ({
    userId,
    docId,
    pageNumber: c.pageNumber,
    chunkIndex: c.chunkIndex,
    text: c.text,
    embedding: vectors[idx]
  }));

  await PolicyChunk.insertMany(docs);
  return docs.length;

/**
 {
  "userId": "123",
  "docId": "abcd",
  "pageNumber": 2,
  "chunkIndex": 0,
  "text": "This policy covers accidental damage...",
  "embedding": [0.123, -0.045, 0.782, ...]
}
 */
}


export async function retrieveRelevantChunks({ userId, docId, query, k = 4 }) {
  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-large" });
  const queryVector = await embeddings.embedQuery(query);
  // tell me about leaves = [0.023, -0.117, 0.044, ..., 0.002]
 const leaves = await embeddings.embedQuery("leaves");
  const filter = { userId };
  if (docId) filter.docId = docId;

  const candidateChunks = await PolicyChunk.find(filter).lean();

  function cosineSim(a, b) {
    let dot = 0,
      na = 0,
      nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
  }

  const scored = candidateChunks.map((c) => ({
    ...c,
    score: cosineSim(queryVector, c.embedding || [])
  }));
  /*
  {
  text: "This policy covers fire accidents...",
  embedding: [...],
  pageNumber: 5,
  score: 0.92
}
   */

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, k);

  return top.map((c) => ({
    text: c.text,
    metadata: {
      pageNumber: c.pageNumber,
      chunkIndex: c.chunkIndex,
      docId: String(c.docId)
    }
  }));
}