const e = require("express");
const { findById } = require("../../models/user/caseGrande.user.model");
const User = require("../../models/user/userManagement.user.model");
const { findUser } = require("../../utils/helper");
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.userId}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserImage = upload.single("picture");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
    });
  }
};

// Update a user by ID or email
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const { firstName, lastName, email, phoneNumber, role } = req.body; // Destructure only the fields you need
    console.log(req.params.id);

    // Prepare update data
    const updateData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      updatedAt: Date.now(),
    };

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log(updatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: "error",
      message: error.message, // Consider returning a user-friendly message instead
    });
  }
};

// Delete a user by ID or email
exports.deleteUser = async (req, res) => {
  try {
    const { deletedBy } = req.body; // Assume you get the admin's ID from the request body

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(
      user._id,
      { deletedAt: Date.now(), deletedBy },
      { new: true }
    );

    res.status(204).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userID = req.userId;
  const picturePath = req.file?.path;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const updateData = {};
    if (picturePath) {
      updateData.picture = picturePath;
    } else {
      const { firstName, lastName, email, phoneNumber } = req.body;
      updateData.firstName = firstName;
      updateData.lastName = lastName;
      updateData.email = email;
      updateData.phoneNumber = phoneNumber;
      updateData.updatedAt = Date.now();
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log(updatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const { firstName, lastName, email, phoneNumber, picture, role } = updatedUser;
    res.status(200).json({
      status: "success",
      data: {
        user: {
          firstName,
          lastName,
          email,
          phoneNumber,
          picture,
          role,
        },
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: "error",
      message: error.message, // Consider returning a user-friendly message instead
    });
  }
};
