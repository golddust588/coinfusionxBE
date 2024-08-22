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

    const generateSevenDigitNumber = () => {
      // Generate a random number between 1000000 and 9999999
      return Math.floor(Math.random() * 9000000) + 1000000;
    };

    const order = new OrderModel({
      date: formattedDateTime,
      trackingNumber: generateSevenDigitNumber(),
      currency: req.body.currency,
      sentAmount: req.body.sentAmount,
      amountToBeReceived: req.body.amountToBeReceived,
      receivingWalletAddress: req.body.receivingWalletAddress,
    });

    const response = await order.save();

    return res.status(201).json({ response: response, status: 201 });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

const FIND_ORDER_BY_TRACKING_NUMBER = async (req, res) => {
  try {
    // Extract the tracking number from the request params or query
    const trackingNumber = req.params.id;

    // Find the order by tracking number
    const order = await OrderModel.findOne({ trackingNumber: trackingNumber });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }

    // Return the found order
    return res.status(200).json({ order: order, status: 200 });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
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

export { INSERT_ORDER, FIND_ORDER_BY_TRACKING_NUMBER, GET_TOKEN_PRICE };
