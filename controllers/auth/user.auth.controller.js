const User = require("../../models/user/userManagement.user.model");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { generateAndStoreTokens } = require("../../utils/generateAndStoreToken");
const sendEmail = require("../../utils/helper");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password,
      createdBy,
    } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "Email already exists",
      });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password,
      createdBy,
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Correo o contraseña no proporcionados !",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Correo o Contraseña incorrectos",
      });
    }
    const { token, refreshToken } = generateAndStoreTokens(res, {
      id: user._id,
      email: user.email,
      role: user.role,
    });
    console.log("Authentication successful");

    res.status(200).json({
      status: "success",
      message: "Usuario autenticado correctamente",
      role: user.role,
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// User logout
exports.logout = async (req, res) => {
  res.clearCookie("access-token");
  res.clearCookie("refresh-token");
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

// change password approved
exports.changePassword = async (req, res) => {
  const userId = req.userId;
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword, newPassword);

    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    console.log(user.password);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        message: "¡La antigua contraseña no coincide!",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.updateOne({ password: hashedPassword });
    res.status(200).json({
      status: "success",
      message: "¡Contraseña cambiada exitosamente!",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      status: "error",
      message: "¡No se pudo actualizar la contraseña!",
    });
  }
};

// User forgot password
exports.forgotPassword = async (req, res) => {
  let user;
  try {
    const { email } = req.body;
    user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message:
          "Usuario no encontrado en base de datos. Por favor, entre un correo válido e intente de nuevo!",
      });
    }
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    user.resetToken = resetToken;
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "Restablecer contraseña",
      resetUrl,
    });
    res.status(200).json({
      status: "success",
      message:
        "Restablecimiento de contraseña enviado correctamente a tu correo!",
    });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    user.resetToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      status: "fail",
      message: "No se pudo enviar el enlace de restablecimiento de contraseña",
    });
  }
};

// User reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to reset password",
    });
  }
};

// Get current user

exports.getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select({
      password: 0,
      deletedAt: 0,
      deletedBy: 0,
      createdAt: 0,
      createdBy: 0,
      updatedAt: 0,
      updatedBy: 0,
      __v: 0,
    });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user",
    });
  }
};
