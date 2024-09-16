import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js"
import { connectDB } from "./db/db.js";


dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true
}))

app.get('/', (req, res) => {
    res.send("Server is running..")
})

app.use('/user', userRoute)


app.listen(5000, () => {
    console.log("server is running.. 3000");
    connectDB();
})