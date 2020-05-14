const {OAuth2Client} = require('google-auth-library');
const moment = require('moment');
const jwt = require("jsonwebtoken");
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
	    // const tokenIssuedate= moment.unix(payload.iat).format("YYYY-MM-DD HH:mm");
	    // const tokenExpdate = moment.unix(payload.exp).format("YYYY-MM-DD HH:mm");



	    // console.log(payload);
	    // console.log("token issue date==== ", tokenIssuedate);
	    // console.log("token expired time =====", tokenExpdate);
	    // const email = payload.email;
	    // // save user into database;

	    
	    // const expiresIn = process.config.TOKEN_EXPIRE_TIME;
            // const secret = process.config.TOKEN_SECRET_KEY;
	    // const accessTokencookie = await jwt.sign(
	    // 	{
	    // 	    accessToken: accessToken
	    // 	},
	    // 	secret,
	    // 	{
	    // 	    expiresIn
	    // 	}
            // );
	    // console.log("accessToken ccokie ====". accessTokencookie);
	    // res.cookie("accessToken", accessTokencookie, {
	    // 	httpOnly: true
            // });
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

}

module.exports = new UserController();
