import Response from "../../app/helper/responseFormat";

// todo: to delete this file

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