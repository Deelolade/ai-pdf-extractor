import express from "express";
import { askAI } from "../utils/ask-ai";

 export const AIrouter = express.Router();

AIrouter.post("/", async (req, res) => {
  const { context, question } = req.body;

//   if (!context || !question) {
//     return res.status(400).json({ message: "Context and question are required" });
//   }

  try {
    const answer = await askAI(context, question);
    res.json({ success: true, answer });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

