const errMessage = require("../../../config/messages.json").errMessages;
const Response = require("../../../app/controllers/helper/responseFormat");

export default permission => (req, res, next) => {
  try {
    const { permissions = [] } = req;
    if (!permissions.includes(permission)) {
      // raise authorization error
      const response = new Response(false, 401);
      response.setError({ status: errMessage.UNAUTHORIZED_ACCESS.status });
      response.setMessage(errMessage.UNAUTHORIZED_ACCESS.message);
      return res.status(401).json(response.getResponse());
    }
  } catch (error) {
    throw error;
  }
  next();
};
