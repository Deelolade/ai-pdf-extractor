import express, { Response } from "express";
import { uploadPdf } from "../controllers/upload.controller";
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
 *         description: Text extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Text extracted successfully
 *                 text:
 *                   type: string
 *                   example: "This is the extracted text from the PDF."
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Internal server error (e.g., database failure)
 */

uploadRouter.post('/',authenticateUser, upload.single('file'), uploadPdf)