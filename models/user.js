const mongoose = require("mongoose");

const mySchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    imageURL: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
    },
    name: {
      type: String,
      required: true,
    },
    conversations:[],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", mySchema);
