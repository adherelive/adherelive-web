const {OAuth2Client} = require('google-auth-library');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const request = require('request');
const Response = require("../helper/responseFormat");

class UserController {
  constructor() {}
    async signInGoogle(req, res){
	
	const authCode=req.body.tokenId;
	const CLIENT_ID = process.config.GOOGLE_KEYS.CLIENT_ID;
	const CLIENT_SECRET = process.config.GOOGLE_KEYS.CLIENT_SECRET;
	const REDIRECT_URI = process.config.GOOGLE_KEYS.REDIRECT_URI;
	try{

	    const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

	    const tokens = await client.getToken(authCode);

	    const idToken = tokens.tokens.id_token;
	    const ticket = await client.verifyIdToken({
	    	idToken: idToken,
	    	audience: CLIENT_ID
	    });

	    const accessToken = tokens.tokens.access_token;
	    console.log("acess token ==== ", accessToken);
	    
	    const payload = ticket.getPayload();
	    console.log(payload);

	    
	    // create user in Db  if does not exist

	    
	    // create jwt token for cookie
	    const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 1 day
            const secret = process.config.TOKEN_SECRET_KEY;
	    const userId = 123456;
	    const accessTokenCombined = await jwt.sign(
		{
		    userId: userId,
		    accessToken: accessToken
		},
		secret,
		{
		    expiresIn
		}
            );
	    
	    
	    
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

	try{
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

	catch(err){
	    console.log(err);
	    throw err;
	}
    }

}

module.exports = new UserController();
