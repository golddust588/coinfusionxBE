import express from "express";

import {
  INSERT_ORDER,
  FIND_ORDER_BY_TRACKING_NUMBER,
  UPDATE_ORDER_BY_ID,
  GET_ALL_ORDERS,
  GET_TOKEN_PRICE,
} from "../controllers/order.js";

const router = express.Router();

router.post("/", INSERT_ORDER);
router.get("/one/:id", FIND_ORDER_BY_TRACKING_NUMBER);
router.put("/one/:id", UPDATE_ORDER_BY_ID);
router.get("/all", GET_ALL_ORDERS);
//Dex tools
router.get("/token-price/eth", GET_TOKEN_PRICE);

export default router;
