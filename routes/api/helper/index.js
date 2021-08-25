import Response from "../../../app/helper/responseFormat";

export const raiseSuccess = (res, code = 200, data = {}, message) => {
  const response = new Response(true, code);
  response.setMessage(message);
  response.setData(data);
  return res.status(code).json(response.getResponse());
};

export const raiseServerError = (res, code = 500, error, message) => {
  const payload = {
    code: code,
    error: errMessage.INTERNAL_SERVER_ERROR
  };
  const response = new Response(false, payload.code);
  response.setError(payload.error);
  response.setMessage("Something went wrong, try again.");
  return res.status(payload.code).json(response.getResponse());
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

export const validationError = (res, isValid) => {
  const { error: { details } = {} } = isValid || {};
  console.log("18971893 details --> ", details);
  if(details) {
    const { context: { label } = {}, message } = details[0] || {};
    const response = new Response(false, 422);
    response.setError(details);
    response.setMessage(label ? label : message);
    return res.status(response.getStatusCode()).json(response.getResponse());
  } else {
    return;
  }
};

export const validationErrorMessage = (res, message) => {
  const response = new Response(false, 422);
  response.setMessage(message ? message : errMessage.CLIENT_ERROR);
  return res.status(response.getStatusCode()).json(response.getResponse());
};

export default {};
