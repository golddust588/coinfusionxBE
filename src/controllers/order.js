import OrderModel from "../models/order.js";
import axios from "axios";
import "dotenv/config";

const INSERT_ORDER = async (req, res) => {
  try {
    const currentDate = new Date();

    // Get the current date components
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are 0-indexed
    const day = currentDate.getDate().toString().padStart(2, "0");

    // Get the current time components
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    // Format the date and time as "yyyy-mm-dd HH:MM"
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    const audit = new OrderModel({
      date: formattedDateTime,
      auditObjNumber: req.body.auditObjNumber,
      auditName: req.body.auditName,
      user_id: req.body.userId,
    });

    const response = await audit.save();

    return res.status(201).json({ response: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "Something went wrong" });
  }
};

// Dex tools data fetch ------------------------------------------------------------------------

const GET_TOKEN_PRICE = async (req, res) => {
  try {
    const chainId = "ether";
    const address = req.params.id;

    // Set up request headers with API key
    const headers = {
      "x-api-key": process.env.DEX_TOOLS_API_KEY,
      accept: "application/json",
    };

    const response = await axios.get(
      `${process.env.DEX_TOOLS_API_BASE_URL}token/${chainId}/${address}/price`,
      {
        headers: headers,
      }
    );

    // Extract token score from response
    const tokenPrice = response.data;
    res.status(200).json({ success: true, tokenPrice });
  } catch (error) {
    console.error("Error fetching token score:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Error fetching token score" });
  }
};

export { INSERT_ORDER, GET_TOKEN_PRICE };
