const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Signup",
  new mongoose.Schema(
    {
      cartNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        trim: true,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      ac_status: {
        type: Number,
        enum: [0, 1, -1],
        default: 0,
      },
      company: String,
      company_slug: String,
      isAccountVerified: {
        type: Boolean,
        default: false,
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      cardVerified: {
        type: Boolean,
        default: false,
      },
      phoneNumber: String,
      isAccountActive: {
        type: Boolean,
        default: false,
      },
      profilePicture: String,
      location: String,
      zipCode: String,
      firstName: String,
      lastName: String,
      paymentMethod: String,
      cardNumber: String,
      firebaseFCM: [],
      companyAssignedBy: {
        type: String,
        default: "User",
      },
      resetPasswordToken: Number,
      resetPasswordExpires: Number,
      refreshToken: String,
      role: {
        type: String,
        enum: ["user", "admin", "super-admin", "removed"],
        default: "user",
      },
    },
    {
      timestamps: true,
    }
  )
);
