import Response from "../../app/helper/responseFormat";
import errMessage from "../../config/messages.json";
// todo: to delete this file

export const validationError = (res, message) => {
  const response = new Response(false, 422);
  response.setMessage(message ? message : errMessage.CLIENT_ERROR);
  return res.status(response.getStatusCode()).json(response.getResponse());
};

export const raiseClientError = (res, code = 422, error, message) => {
  const payload = {
    code: code,
    error: error || errMessage.CLIENT_ERROR
  };

  const response = new Response(false, payload.code);
  response.setError(payload.error);
  response.setMessage(message);
  return res.status(payload.code).json(response.getResponse());
};
