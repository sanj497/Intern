import User from "../model/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can log in." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ token, data: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};