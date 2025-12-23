import express, { Response, Request } from "express";
import { connectDb } from "./utils/db";
import chalk from "chalk";
import { userRouter } from "./routes/auth.routes";
import { globalErrorHandler } from "./middleware/errorMiddleware";
import { documentRouter } from "./routes/document.route";
import { setupSwagger } from "./utils/swagger";
import cors from "cors";
import { FRONTEND_URL } from "./utils/env";
import { paymentRouter } from "./routes/payment.route";
import cookieParser from "cookie-parser"
import { folderRouter } from "./routes/folders.route";
import { dashboardRouter } from "./routes/dashboard.route";
import mongoose from "mongoose";
import { postHog } from "./utils/posthog";

const app = express();
app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', 1);
const PORT = 5000;
connectDb()
setupSwagger(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://docfeel.com",
  "https://www.docfeel.com",
  "https://docfeel.vercel.app",
  "http://localhost:3000"
].filter(Boolean);

const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        console.log("Incoming origin:", origin);
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return  callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsConfig));
// ROUTES
app.use('/api/auth', userRouter)
app.use('/api/document', documentRouter)
app.use('/api/folders', folderRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/payments', paymentRouter)
app.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    res.send(`welcome to the best pdf extractor !!`)
  } catch (error) {
    console.error("error", error)
    res.status(500).send('server error')
  }
})
app.get('/health', async (req: Request, res: Response)=>{
  try {
    const ping = await mongoose.connection.db?.admin().ping();
    if(!ping) return;
    
    res.status(200).json({
      status: "ok",
      database: ping.ok === 1 ? "Connected" :"down",
      uptime: process.uptime(),
      timestamp: Date.now()
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database:'down',
      error: err
    })
  }
})

app.use(globalErrorHandler)
app.listen(PORT, () => {
  console.log(chalk.blue(`app running on  localhost:${PORT}`))
})