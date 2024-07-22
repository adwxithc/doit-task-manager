import express from "express";
import "express-async-errors";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import { authRouter } from "./routes/authRouter";
import { errorHandler } from "./middlewares/error-handler";


dotenv.config();

const app = express();

app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:3000", 
    credentials: true, 
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.set("trust proxy", true);


app.use(cors(corsOptions));

const httpServer = http.createServer(app);

app.use("/api/auth",authRouter(express.Router()));


app.use(errorHandler);

export { app, httpServer };
