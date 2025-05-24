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

    // ←– new field
    university: {
      type: String,
      enum: ["IUT", "DU", "BUET"],
      required: false,
    },
    dept: {
      type: String,
      required: false,
    },
    program: {
      type: String,
      required: false,
    },
    yearOfStudy: {
      type: Number,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    contactNo: {
      type: String,
      required: false,
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
