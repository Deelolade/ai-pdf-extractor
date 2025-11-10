import express from "express";
import { uploadPdf,summarizePdf, getAllMyDocuments, deleteDocument, getDocument, updateDocument } from "../controllers/document.controller"
import multer from "multer";
import { authenticateUser } from "../middleware/authMiddleware";
import { converseRateLimiter, createSummaryLimiter, createUploadLimiter, deleteUploadLimiter, getAllUploadsLimiter, updateDocumentLimiter } from "../utils/rate-limiter";
import { converseWithLLM } from "../controllers/converseWithLLM.controller";
import { checkSubscription } from "../middleware/checkSubscription";

export const documentRouter =express.Router();
const upload = multer({storage: multer.memoryStorage()});

/**
 * @openapi
 * /api/document/create:
 *   post:
 *     summary: Upload a PDF file and extract text
 *     description: Uploads a PDF file, extracts its text, and returns the extracted content.
 *     tags:
 *       - Document
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
documentRouter.post('/create',authenticateUser, createUploadLimiter, upload.single('document'), uploadPdf);

/**
 * @openapi
 * /api/document/summarize/{uploadId}:
 *   post:
 *     summary: Summarize text into concise form using AI
 *     description: Summarize text to be easily readable.
 *     tags:
 *       - Document
 *     parameters:
 *       - in : path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: string
 *         description:  The id for text content of the PDF to be summarized
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
documentRouter.post('/summarize/:uploadId',authenticateUser, checkSubscription, createSummaryLimiter, summarizePdf);

/**
 * @openapi
 * /api/document/:
 *   get:
 *     summary: Fetch all uploads of the authenticated user
 *     description: Retrieves all PDF uploads and summaries associated with the authenticated user.
 *     tags:
 *       - Document
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
documentRouter.get('/',authenticateUser,getAllUploadsLimiter, getAllMyDocuments)
/**
 * @openapi
 * /api/document/{uploadId}:
 *   get:
 *     summary: Fetch a uploaded document of an authenticated user
 *     description: Retrieves a PDF uploaded and summary associated with the authenticated user.
 *     tags:
 *       - Document
 *     parameters:
 *       - in : path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: string
 *         description:  The id for text content of the PDF to be summarized
 *     responses:
 *       200:
 *         description: Document fetched successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error (e.g., database failure)
 */

documentRouter.get('/:uploadId',authenticateUser,getAllUploadsLimiter, getDocument);

/**
 * @openapi
 * /api/document/{id}:
 *   delete:
 *     summary: Delete upload of the authenticated user
 *     description: Delete uploaded document of an authenticated user.
 *     tags:
 *       - Document
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
documentRouter.delete('/:id',authenticateUser, deleteUploadLimiter, deleteDocument)

/**
 * @openapi
 * /api/document/converse/{uploadId}:
 *   post:
 *     summary: Hold conversations with the LLM to know more details about a document
 *     description: Send a message to the LLM to ask questions or request insights about the uploaded document.
 *     tags:
 *       - Document
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the document to converse about
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message or question to the LLM
 *     responses:
 *       200:
 *         description: Response generated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Document not found or unauthorized
 *       500:
 *         description: Internal server error (e.g., AI or database failure)
 */
documentRouter.post('/converse/:uploadId', authenticateUser, checkSubscription,converseRateLimiter, converseWithLLM);

/**
 * @openapi
 * /api/document/update/{id}:
 *   patch:
 *     summary: Update document file name
 *     description: Change the name of an uploaded document by its ID.
 *     tags:
 *       - Document
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the document to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: The new name for the document
 *     responses:
 *       200:
 *         description: Document file name updated successfully
 *       400:
 *         description: Invalid input or missing file name
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */

documentRouter.patch('/update/:id',authenticateUser,updateDocumentLimiter, updateDocument)


