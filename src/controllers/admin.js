import AdminModel from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const LOGIN = async (req, res) => {
  const user = await AdminModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({ message: "Bad authentication" });
  }

  bcrypt.compare(req.body.password, user.password, (err, isPasswordMatch) => {
    if (!isPasswordMatch || err) {
      return res.status(401).json({ message: "Bad authentication" });
    }

    const jwt_token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      { algorithm: "RS256" }
    );

    return res.status(200).json({
      message: "Login successful",
      name: user.name,
      user_id: user._id,
      jwt_token: jwt_token,
    });
  });
};

const CHANGE_PASSWORD = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Retrieve user from the database
    const user = await AdminModel.findById({ _id: req.body.userId });

    // If user exists, check if the current password matches
    if (user) {
      // Compare current password with hashed password stored in the database
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      // If current password matches, hash the new password and update
      if (isPasswordMatch) {
        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

        // Update user's password with the hashed password
        user.password = hash;

        // Save the updated user object
        await user.save();

        // New JWT

        const jwt_token = jwt.sign(
          { email: user.email, userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "12h" },
          { algorithm: "RS256" }
        );

        return res.status(201).json({
          message: "Password updated successfully",
          jwt_token: jwt_token,
        });
      } else {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { LOGIN, CHANGE_PASSWORD };
