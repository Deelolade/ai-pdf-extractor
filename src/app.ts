import express from "express";
import { connectDb } from "./utils/db";
import chalk from "chalk";

const app = express();
const PORT = 5000;
connectDb()

app.get('/', async(req, res): Promise<void> =>{
  try {
    res.send(`welcome to the best pdf extractor !!`)
  } catch (error) {
    console.error("error", error)
    res.status(500).send('server error')
  }
})
app.listen(PORT, ()=>{
  console.log(chalk.green(`app running on  localhost:${PORT}`))
})