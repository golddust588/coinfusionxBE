import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import adminRoute from "./src/routes/admin.js";
import auditRoute from "./src/routes/order.js";

import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoute);
app.use("/order", auditRoute);

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log(`CONNECTED on port ${process.env.PORT}!!!`))
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log("App started");
});
