/**
 * @author Gaurav Sharma
 * @email gaurav6421@gmail.com
 * @create date 2021-04-16 09:30:27
 * @modify date 2021-05-09 16:59:35
 * @desc topic model.
 */

const mongoose = require("mongoose");

// Add this line to handle the deprecation warning
//mongoose.set("strictQuery", true);

const topicSchema = mongoose.Schema(
  {},
  {
    strict: false,
    timestamp: true,
  }
);

module.exports = mongoose.model("cdss", topicSchema);
