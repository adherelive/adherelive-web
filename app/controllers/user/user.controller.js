const {OAuth2Client} = require('google-auth-library');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const request = require('request');
const Response = require("../helper/responseFormat");

class UserController {
  constructor() {}
    async signInGoogle(req, res){
	
	const token=req.body.tokenId;
	const accessToken=req.body.accessToken;
	const CLIENT_ID = "398277517704-eqh1lvm3872s2a5t916kua18gp60steu.apps.googleusercontent.com";
	const CLIENT_SECRET = "KszeHfBloxPaTayEXB_y6WQg";
	const REDIRECT_URI = "postmessage";
	console.log("token =========== ", token);
	try{

	    
	    const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

	    const tokens = await client.getToken(token);

	    const idToken = tokens.tokens.id_token;
	    const ticket = await client.verifyIdToken({
	    	idToken: idToken,
	    	audience: CLIENT_ID
	    });

	    const refreshToken = tokens.tokens.refresh_token;
	    console.log("refresh token ====== ",refreshToken);
	    
	    const payload = ticket.getPayload();
	    console.log(payload);
	    let response = new Response(true, 200);
	    response.setMessage("Sign in successful!");
	     return res
		.status(response.getStatusCode())
		.send(response.getResponse());
	}

	catch(err){
	    console.log("error ======== ",err);
	    //throw err;
	    let response = new Response(false, 200);
	    response.setMessage("Sign in Unsuccessful!");
	    return res
		.status(response.getStatusCode())
		.send(response.getResponse());
	}
    }


    async signInFacebook(req, res){
	const {accessToken} = req.body;

	request(`https://graph.facebook.com/v2.3/oauth/access_token?grant_type=fb_exchange_token&client_id=3007643415948147&client_secret=60d7c3e6dc4aae01cd9096c2749fc5c1&fb_exchange_token=${accessToken}`, { json: true }, (err, res, body) => {
	    if (err) { return console.log(err); }
	    console.log("body ======== ",res.body.access_token);
	    console.log(res.body.access_token);
	});
	
	let response = new Response(true, 200);
	response.setMessage("Sign in successful!");
	return res
	    .status(response.getStatusCode())
	    .send(response.getResponse());
    }

}

module.exports = new UserController();
