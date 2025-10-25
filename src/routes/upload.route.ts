import express from "express";
import { uploadPdf,summarizePdf } from "../controllers/upload.controller";
import multer from "multer";
import { authenticateUser } from "../middleware/authMiddleware";

export const uploadRouter =express.Router();
const upload = multer({storage: multer.memoryStorage()});

/**
 * @openapi
 * /api/upload:
 *   post:
 *     summary: Upload a PDF file and extract text
 *     description: Uploads a PDF file, extracts its text, and returns the extracted content.
 *     tags:
 *       - PDF
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to be uploaded
 *     responses:
 *       200:
 *         description: File uploaded and text extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded and text extracted successfully
 *                 text:
 *                   type: string
 *                   example: "This is the extracted text from the PDF."
 *       400:
 *         description: Upload Id is required for summarization
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error (e.g., database failure)
 */

uploadRouter.post('/',authenticateUser, upload.single('file'), uploadPdf)
/**
 * @openapi
 * /api/upload/summarize:
 *   post:
 *     summary: Summarize text into concise form using AI
 *     description: Summarize text to be easily readable.
 *     tags:
 *       - PDF
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - uploadId
 *             properties:
 *              uploadId:
 *               uploadId: string
 *               description: The id for text content of the PDF to be summarized
 *     responses:
 *       200:
 *         description: PDF summarized successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Internal server error (e.g., database failure)
 */

uploadRouter.post('/summarize',authenticateUser, summarizePdf)