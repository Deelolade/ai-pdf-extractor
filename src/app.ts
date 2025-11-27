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

const app = express();
app.use(express.json())
app.use(cookieParser())
const PORT = 5000;
connectDb()
setupSwagger(app);

const corsConfig = {
  origin: FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

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

app.use(globalErrorHandler)
app.listen(PORT, () => {
  console.log(chalk.blue(`app running on  localhost:${PORT}`))
})