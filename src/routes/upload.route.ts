import express from "express";
import { uploadPdf,summarizePdf, getAllMyUploads, deleteUpload } from "../controllers/upload.controller";
import multer from "multer";
import { authenticateUser } from "../middleware/authMiddleware";
import { createSummaryLimiter, createUploadLimiter, deleteUploadLimiter, getAllUploadsLimiter } from "../utils/rate-limiter";
import { converseWithLLM } from "../controllers/converseWithLLM.controller";

export const documentRouter =express.Router();
const upload = multer({storage: multer.memoryStorage()});

/**
 * @openapi
 * /api/document/create:
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

documentRouter.post('/create',authenticateUser,createUploadLimiter, upload.single('file'), uploadPdf)
/**
 * @openapi
 * /api/document/summarize:
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
 *       404:
 *         description: User not found 
 *       500:
 *         description: Internal server error (e.g., database failure)
 */

documentRouter.post('/summarize',authenticateUser,createSummaryLimiter, summarizePdf);
/**
 * @openapi
 * /api/document/:
 *   get:
 *     summary: Fetch all uploads of the authenticated user
 *     description: Retrieves all PDF uploads and summaries associated with the authenticated user.
 *     tags:
 *       - PDF
 *     responses:
 *       200:
 *         description: Uploads fetched successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error (e.g., database failure)
 */
documentRouter.get('/',authenticateUser,getAllUploadsLimiter, getAllMyUploads)
/**
 * @openapi
 * /api/document/{id}:
 *   delete:
 *     summary: Delete upload of the authenticated user
 *     description: Delete uploaded document of an authenticated user.
 *     tags:
 *       - PDF
 *     parameters:
 *       - in : path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id to delete the upload
 *     responses:
 *       200:
 *         description: Upload have been deleted successfully !!
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Upload not found or unauthorized 
 *       500:
 *         description: Internal server error (e.g., database failure)
 */
documentRouter.delete('/:id',authenticateUser, deleteUploadLimiter, deleteUpload)



documentRouter.post('/converse', authenticateUser, converseWithLLM);