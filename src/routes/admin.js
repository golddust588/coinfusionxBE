import express from "express";
import auth from "../middlewares/auth.js";

import { LOGIN, CHANGE_PASSWORD } from "../controllers/admin.js";

const router = express.Router();

router.post("/login", LOGIN);
router.post("/change-password", auth, CHANGE_PASSWORD);

export default router;
