import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function chunkPagesToDocs(pages, options = {}) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: options.chunkSize || 1000,
    chunkOverlap: options.chunkOverlap || 150
  });

  const allChunks = [];
  for (const page of pages) {
    const chunks = await splitter.splitText(page.pageContent || page.text || "");
    chunks.forEach((chunkText, idx) => {
      allChunks.push({
        pageNumber: page.metadata?.pageNumber ?? page.pageNumber ?? null,
        chunkIndex: idx,
        text: chunkText
      });
    });
    /*
→ chunk 1: chars 0–1000
→ chunk 2: chars 850–1850 (overlap)
→ chunk 3: chars 1700–2700 ...
     */
  }
  return allChunks;
}