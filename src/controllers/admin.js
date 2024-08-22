import AdminModel from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const LOGIN = async (req, res) => {
  const admin = await AdminModel.findOne({ name: req.body.name });

  if (!admin) {
    return res.status(401).json({ message: "Bad authentication" });
  }

  bcrypt.compare(req.body.password, admin.password, (err, isPasswordMatch) => {
    if (!isPasswordMatch || err) {
      return res.status(401).json({ message: "Bad authentication" });
    }

    const jwt_token = jwt.sign(
      { name: admin.name, adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      { algorithm: "RS256" }
    );

    return res.status(200).json({
      message: "Login successful",
      jwt_token: jwt_token,
      status: 200,
    });
  });
};

const CHANGE_PASSWORD = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    // Retrieve user from the database
    const admin = await AdminModel.findOne({ name: req.body.name });

    // If user exists, check if the current password matches
    if (admin) {
      // Compare current password with hashed password stored in the database
      const isPasswordMatch = await bcrypt.compare(password, admin.password);

      // If current password matches, hash the new password and update
      if (isPasswordMatch) {
        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

        // Update user's password with the hashed password
        admin.password = hash;

        await admin.save();

        // New JWT

        const jwt_token = jwt.sign(
          { name: admin.name, adminId: admin._id },
          process.env.JWT_SECRET,
          { expiresIn: "24h" },
          { algorithm: "RS256" }
        );

        return res.status(201).json({
          message: "Password updated successfully",
          jwt_token: jwt_token,
          status: 201,
        });
      } else {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
    } else {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { LOGIN, CHANGE_PASSWORD };
