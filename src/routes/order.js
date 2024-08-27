import express from "express";

import {
  INSERT_ORDER,
  FIND_ORDER_BY_TRACKING_NUMBER,
  GET_TOKEN_PRICE,
} from "../controllers/order.js";

const router = express.Router();

router.post("/", INSERT_ORDER);
router.get("/:id", FIND_ORDER_BY_TRACKING_NUMBER);
//Dex tools
router.get("/token-price/eth", GET_TOKEN_PRICE);

export default router;
