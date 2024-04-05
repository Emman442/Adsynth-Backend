const mongoose = require("mongoose");
const campaignSchema = new mongoose.Schrma(
  {
    name: {
      type: String,
      required: [true, "please provide a campaign name!"],
    },
    purpose: {
      type: String,
      required: [true, "please provide a campaign purpose!"],
    },
    start_date: {
      type: Date,
      // required: [true, "please provide a campaign purpose!"],
      default: Date.now(),
    },
    end_date: {
      type: Date,
      // required: [true, "please provide a campaign purpose!"],
      default: Date.now(),
    },
    photos: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
