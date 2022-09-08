const mongoose = require("mongoose");
module.exports = async () => {
  try {
    await mongoose.connect("mongodb://adherelive:Q3xbZbp5f7O0AqR4@adherelive.aqaaqxe.mongodb.net/adherecdss", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
    });
    console.log("Successfully Connected with mongo Database");
  } catch (ex) {
    console.log(ex);
  }
};
