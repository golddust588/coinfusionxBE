import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  date: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  currency: { type: String, required: true },
  transactions: [
    {
      receivingWalletAddress: { type: String, required: true },
      sentAmount: { type: Number, required: true },
      amountToBeReceived: { type: Number, required: true },
    },
  ],
  approved: { type: Boolean, default: false, required: true },
  delivered: { type: Boolean, default: false, required: true },
});

export default mongoose.model("Order", orderSchema);
