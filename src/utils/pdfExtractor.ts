const { PDFParse } = require("pdf-parse");

export const extractTextFromPdf = async (
    fileUrl: string,
    maxPages: number = 5
): Promise<string> => {
    try {
        const parser = new PDFParse({ url: fileUrl });
        const pdfData = await parser.getText();
        
        const textArray = pdfData.text.split(/\f+/); 
        const limitedText = textArray.slice(0, maxPages).join("\n");

        return limitedText.trim();
    } catch (error) {
        console.log("Error reading pdf:", error)
        throw new Error("Failed to extract text from pdf" + (error as Error).message)
    }
}