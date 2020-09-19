import Response from "../../../app/helper/responseFormat";

export const validationError = (res, isValid) => {
    const { error: { details } = {} } = isValid || {};
    console.log("18971893 details --> ", details);
    if(details) {
        const { context: { label } = {}, message } = details[0] || {};
        const response = new Response(false, 422);
        response.setError(details);
        response.setMessage(message ? message : label);
        return res.status(response.getStatusCode()).json(response.getResponse());
    } else {
        return;
    }
};