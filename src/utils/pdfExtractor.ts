import axios from "axios";
// import pdfParse from "pdf-parse";
// import * as pdfParse from "pdf-parse";
// import pdfParse from "pdf-parse";
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

    console.log("pdfParse type:", typeof pdfParse);
console.log("pdfParse keys:", Object.keys(pdfParse));
console.log(fileUrl)
    const dataBuffer = Buffer.from(response.data);
     console.log("Parsing PDF...");
    const pdfData = await pdfParse(dataBuffer); // ❌ remove the { max: maxPages } argument
        console.log("PDF parsed successfully.");
      // Manually limit pages by splitting text
    const textArray = pdfData.text.split(/\f+/); // \f = page break
    const limitedText = textArray.slice(0, maxPages).join("\n");

    return limitedText.trim();
    } catch (error) {
        console.log("Error reading pdf:", error)
        throw new Error("Failed to extract text from pdf" + (error as Error).message)
    }
}