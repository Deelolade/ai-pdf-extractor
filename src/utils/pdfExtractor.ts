import axios from "axios";
// import pdfParse from "pdf-parse";
// import * as pdfParse from "pdf-parse";
const pdfParse = require("pdf-parse");

export const extractTextFromPdf = async ( 
    fileUrl: string,
    maxPages: number = 5
): Promise<string> => {
    try {
         console.log("Downloading file from URL...");
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const dataBuffer = Buffer.from(response.data);
    console.log("Parsing PDF...");
    const pdfData = await pdfParse(dataBuffer, { max: maxPages });
    return pdfData.text;
    } catch (error) {
        console.log("Error reading pdf:", error)
        throw new Error("Failed to extract text from pdf" + (error as Error).message)
    }
}