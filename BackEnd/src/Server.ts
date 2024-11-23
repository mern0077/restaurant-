import express from "express"
import bodyparser from "body-parser"
import cors from "cors"
import dotenv from "dotenv";
import userRoute from "./routes/user.routes.js"
import restaurantRoute from "./routes/restaurant.routes.js"
import menuRoute from "./routes/menu.routes.js"
import orderRoute from "./routes/order.routes.js"
import { connectDB } from "./db/connectDB";
import cookieParser from "cookie-parser";

dotenv.config();

connectDB();
 
const app = express();

const PORT = process.env.PORT || 8000;

// default middleware
app.use(bodyparser.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser());
app.use(express.json());
const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,

}

app.use(cors(corsOption));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
})  