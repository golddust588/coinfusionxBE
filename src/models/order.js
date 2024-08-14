import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  date: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  currency: { type: String, required: true },
  sentAmount: { type: Number, required: true },
  amountToBeReceived: { type: Number, required: true },
  receivingWalletAddress: { type: String, required: true },
  approved: { type: String, default: false, required: true },
  delivered: { type: String, default: false, required: true },
});

export default mongoose.model("Order", orderSchema);
