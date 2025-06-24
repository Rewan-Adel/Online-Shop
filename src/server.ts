import express from "express";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import rateLimit    from "express-rate-limit";
import compression  from "compression";
import helmet       from "helmet";
import cors         from "cors";
import path         from "path";
import "dotenv/config";

import {failedResponse} from "./middlewares/responseHandler";
import dbConnection     from "./config/dbConnection";
import BackgroundJob    from "./utils/BackgroundJob";

import authRoutes     from "./routes/authRoute";
import userRoutes     from "./routes/userRoute";
import categoryRoutes from "./routes/categoryRoue";
import productRoutes  from "./routes/productRoute";
import cartRoutes     from "./routes/cartRoute";
import orderRoutes    from "./routes/orderRoute";
import reviewRoutes   from "./routes/reviewRoute";

const app = express();
const port = process.env.PORT || 3000;

if(process.env.NODE_ENV == "production"){
    app.use(compression());
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
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


app.use("/api/auth",     authRoutes);
app.use("/api/user",     userRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/order",    orderRoutes);
app.use("/api/review",   reviewRoutes);
app.use("/api/product",  productRoutes);
app.use("/api/category", categoryRoutes);

app.all("*", (req: Request, res: Response) => {
    failedResponse(res, 404, `can't find ${req.originalUrl} on this server!`);
});

new dbConnection();
new BackgroundJob();

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});

export default app;

