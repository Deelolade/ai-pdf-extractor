import express, {Response, Request} from "express";
import { connectDb } from "./utils/db";
import chalk from "chalk";
import { userRouter } from "./routes/user.routes";
import { globalErrorHandler } from "./middleware/errorMiddleware";
import { extractTextFromPdf } from "./utils/pdfExtractor";
import { PDFParse } from 'pdf-parse';

const app = express();
app.use(express.json())
app.use(globalErrorHandler)
const PORT = 5000;
// connectDb()

app.use('/api/user',userRouter)
app.get('/', async(req:Request, res: Response): Promise<void> =>{
  try {
    res.send(`welcome to the best pdf extractor !!`)
  } catch (error) {
    console.error("error", error)
    res.status(500).send('server error')
  }
})
app.listen(PORT, ()=>{
  console.log(chalk.blue(`app running on  localhost:${PORT}`))
})