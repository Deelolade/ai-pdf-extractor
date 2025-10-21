import fs from "fs"
import path from "path";

const pdfParse = require("pdf-parse").default;
export const extractTextFromPdf = async (
      relativePath: string,
        maxPages: number = 5
): Promise<string> => {
    try {
        // const parser = new PDFParse({ url: filepath });
        // const result = await parser.getText();
        // // to extract text from page 3 only:
        // // const result = await parser.getText({ partial: [3] });
        // await parser.destroy();
        // console.log(result.text);



        const filepath = path.resolve(__dirname, relativePath)
        console.log("Reading file to buffer...");

        const dataBuffer = fs.readFileSync(filepath);
        console.log("Parsing PDF...");

        const pdfData = await pdfParse(dataBuffer, { max: maxPages })
        console.log("Parsing done.");

        return pdfData.text;
    } catch (error) {
        console.log("Error reading pdf:", error)
        throw new Error("Failed to extract text from pdf" + (error as Error).message)
    }
}