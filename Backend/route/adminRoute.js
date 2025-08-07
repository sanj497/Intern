import express from "express";
import { adminLogin} from "../controller/adminController.js";

const router = express.Router();

// Admin login route
router.post("/admin/login", adminLogin);


export default router;
