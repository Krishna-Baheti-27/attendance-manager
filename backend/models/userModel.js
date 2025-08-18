// models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      }, // only required if there is no googleId
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    googleAccessToken: {
      type: String,
      select: false,
    },
    googleRefreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password matching logic
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
