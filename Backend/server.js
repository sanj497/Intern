import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import khaltiRoutes from "./route/khaltiRoute.js";
import userroute from "./route/userroute.js"
import productroute from "./route/product.js"
import favoriteRoutes from './route/favoriteRoutes.js';
import adminRoute from './route/adminRoute.js';
dotenv.config();         
connectDB();            

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/khalti", khaltiRoutes); 
app.use("/api/auth", userroute); 
app.use("/api/product", productroute); 
app.use("/api", adminRoute); 

app.use("/api/",favoriteRoutes ); 


// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(port, () => {
  console.log(` Server is running on PORT ${port}`); 
  console.log(` Backend URI: ${process.env.BACKEND_URI}`);
});
