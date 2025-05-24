const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.uid;
      },
    },
    img: String,
    desc: String,
    uid: {
      type: String,
      unique: true,
      sparse: true,
    },

    // ←– remove petTypes and areas here

    // ←– add these
    dept: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    yearOfStudy: {
      type: Number,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
    blockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Hasblocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
