import Response from "../../../app/helper/responseFormat";

export const validationError = (res, isValid) => {
  const { error: { details } = {} } = isValid || {};
  if (details) {
    const { context: { label } = {}, message } = details[0] || {};
    const response = new Response(false, 422);
    response.setError(details);
    response.setMessage(label ? label : message);
    return res.status(response.getStatusCode()).json(response.getResponse());
  } else {
    return;
  }
};

export const raiseClientError = (res, code = 422, error = {}, message) => {
  const payload = {
    code,
    error
  };

  const response = new Response(false, payload.code);
  response.setError(payload.error);
  response.setMessage(message);
  return res.status(payload.code).json(response.getResponse());
};
