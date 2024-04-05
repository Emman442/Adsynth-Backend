const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a campaign name!"],
    },
    email: {
      type: String,
      required: [true, "please provide a customer email!"],
    //   unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, "please provide a customer phone Nuumber!"],

    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    billing_address: {
        type: String
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Customers", customerSchema);
