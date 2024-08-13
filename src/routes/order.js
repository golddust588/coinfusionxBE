import express from "express";

import { INSERT_ORDER, GET_TOKEN_PRICE } from "../controllers/order.js";

const router = express.Router();

router.post("/", INSERT_ORDER);

//Dex tools
router.get("/token-price/:id", GET_TOKEN_PRICE);

export default router;
