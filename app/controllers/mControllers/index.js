const errMessage = require("../../../config/messages.json").errMessages;
const Response = require("../../helper/responseFormat");

class mController {
  constructor() {}

  raiseSuccess = (res, code = 200, data = {}, message) => {
    const response = new Response(true, code);
    response.setMessage(message);
    response.setData(data);
    return res.status(code).json(response.getResponse());
  };

  raiseServerError = (res, code = 500, error = {}, message = "") => {
    const response = new Response(false, code);
    response.setMessage(errMessage.INTERNAL_SERVER_ERROR.message);
    return res.status(code).json(response.getResponse());
  };

  raiseClientError = (res, code = 422, error, message) => {
    const payload = {
      code: code,
      error: error || errMessage.CLIENT_ERROR,
    };

    const response = new Response(false, payload.code);
    response.setError(payload.error);
    response.setMessage(message);
    return res.status(payload.code).json(response.getResponse());
  };
}

module.exports = mController;
