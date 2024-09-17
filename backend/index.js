import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import { connectDB } from "./db/db.js";



dotenv.config();

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json({ limit: "5mb" })); // parse JSON request bodies


app.get('/', (req, res) => {
    res.send("Server is running..")
})

app.use('/user', userRoute);
app.use("/user/post", postRoutes);



app.listen(5000, () => {
    console.log("server is running.. 5000");
    connectDB();
})