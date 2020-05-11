const Logger = require("../../../libs/log");
const Response = require("../../helper/responseFormat");
const errMessages = require("../../../config/messages.json").errMessages;
const constants = require("../../../config/constants");

function handleError(err, _, res, __) {
  const Log = Logger("filename,lineNo");
  Log.debug(err);
  let payload;

  switch (err.message) {
    case constants.UNAUTHORIZED_ACCESS:
      payload = {
        code: 403,
        error: errMessages.UNAUTHORIZED_ACCESS
      };
      break;
    default:
      payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      break;
  }

  let response = new Response(false, payload.code);
  response.setError(payload.error);
  return res.status(payload.code).json(response.getResponse());
}

module.exports = handleError;
