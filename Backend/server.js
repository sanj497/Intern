import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import khaltiRoutes from "./route/khaltiRoute.js";
import userroute from "./route/userroute.js";
import productroute from "./route/product.js";
import favoriteRoutes from './route/favoriteRoutes.js';
import adminRoute from './route/adminRoute.js';
import orderRoute from './route/orderRoute.js';
import cartRoute from './route/cartRoute.js';
import contactRoute from './route/contactRoute.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/khalti", khaltiRoutes);
app.use("/api/auth", userroute);
app.use("/api/product", productroute);
app.use("/api", adminRoute);
app.use("/api", favoriteRoutes);
app.use("/api", orderRoute);
app.use("/api", cartRoute);
app.use("/api", contactRoute);

app.get("/", (req, res) => res.send("API is running..."));

app.listen(process.env.PORT || 5000, () => {
  console.log(` Server is running on PORT ${process.env.PORT || 5000}`);
  console.log(` Backend URI: http://localhost:${process.env.PORT || 5000}`);
});