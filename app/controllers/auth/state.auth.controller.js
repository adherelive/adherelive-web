const Response = require("../../helper/responseFormat");
const jwt = require("jsonwebtoken");
const errMessages = require("../../../config/messages.json").errMessages;
const constants = require("../../../config/constants");

async function stateAuthenticate(req, res, next) {
	try {
		const { code, state } = req.query;
		const secret = process.config.TOKEN_SECRET_KEY;
		let decodedState = await jwt.verify(state, secret);
		if (decodedState.userId == req.userDetails.userId) {
			req.internalRedirectUri = decodedState.internalRedirectUri;
			next();
		} else {
			throw new Error(constants.FORBIDDEN);
		}
	} catch (err) {
		let payload;

		switch (err.message) {
			case constants.FORBIDDEN:
				payload = {
					code: 403,
					error: errMessages.FORBIDDEN
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
}

module.exports = stateAuthenticate;
