import express from "express";
import { Request, Response } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import {failedResponse} from "./middlewares/responseHandler";
import dbConnection from "./config/dbConnection";
import authRoutes from "./routes/authRoute";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(express.static(path.join(process.cwd(), "public")));
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.set('trust proxy', 1);
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes)
if(process.env.NODE_ENV == "production"){
    app.use(compression());
}

app.all("*", (req: Request, res: Response) => {
    failedResponse(res, 404, `can't find ${req.originalUrl} on this server!`);
});

new dbConnection();

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});

export default app;

