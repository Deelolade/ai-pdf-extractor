import fs from "fs"
import pdfParse from "pdf-parse";

export const extractTextFromPdf = async (
    filepath: string,
    maxPages: number = 5
    ): Promise<string> => {
    try {
        const dataBuffer = fs.createReadStream(filepath);

        const pdfData = await pdfParse(dataBuffer, {max:maxPages})

        return pdfData.text;
    } catch (error) {
        console.log("Error reading pdf:", error)
        throw new Error("Failed to extract text from pdf")
    }
}