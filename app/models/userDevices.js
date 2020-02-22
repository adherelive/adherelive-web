const mongoose = require("mongoose");

const UserDeviceSchema = new mongoose.Schema(
  {
    device_id: {
      type: Number
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    platform: {
      type: String
    },
    one_signal_user_id: {
      type: String
    },
    push_token: {
      type: String
    }
  },
  {
    collection: "userDevices",
    timestamps: true
  }
);

module.exports = mongoose.model("userDevice", UserDeviceSchema);
