import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    passwordHash: {
      type: String,
      required: true,
    },
    itemsPosted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    itemsSwapped: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    chatIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        default: "Point",
      },
      coordinates: {
        type: [Number], // First longitude, then latitude
        index: "2dsphere", // Create a geospatial index for efficient querying
      },
      address: String,
    },
  },
  { timestamps: true }
);

// Password hashing middleware before saving the User model
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified("passwordHash")) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

// Static method to check user password
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Ensure the geospatial index is created
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;
