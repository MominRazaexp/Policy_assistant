import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function loadPDF(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: true });
  const docs = await loader.load();
  return docs.map((d, i) => {
    const pageNumber =
      d.metadata?.loc?.pageNumber ??
      d.metadata?.pageNumber ??
      d.metadata?.pdf?.pageNumber ??
      i + 1;
    return {
      pageContent: d.pageContent,
      metadata: { pageNumber }
    };
    /**
 * Loads a PDF file and returns an array of { pageContent, metadata: { pageNumber } }
 * [
  { pageContent: "Page 1 text...", metadata: { pageNumber: 1 } },
  { pageContent: "Page 2 text...", metadata: { pageNumber: 2 } },
  ...
]
 */
  });
}