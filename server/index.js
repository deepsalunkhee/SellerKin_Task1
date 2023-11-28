const express = require('express');
const fetch = require("node-fetch");
const crypto = require("crypto");
const dotenv = require('dotenv');


let tokenData = '';


const port = 3000;
const baseurl = `http://localhost:${port}`
dotenv.config();
const apitoken = process.env.API_TOKEN;
const contexts = 'listings_r'


const app = express();



const base64URLEncode = (str) =>
  str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest();

const codeVerifier = base64URLEncode(crypto.randomBytes(32));

const codeChallenge = base64URLEncode(sha256(codeVerifier));
const state = Math.random().toString(36).substring(7);

const buildMyUrl = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${baseurl}/callback&scope=${contexts}&client_id=${apitoken}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`


app.get('/ping', async (req, res) => {
    const requestOptions = {
        'method': 'GET',
        'headers': {
            'x-api-key': apitoken,
        },
    };

    const response = await fetch(
        'https://api.etsy.com/v3/application/openapi-ping',
        requestOptions
    );

    if (response.ok) {
        const data = await response.json();
        res.send(data);
    } else {
        res.send("oops");
    }
});


app.get('/', async (req, res) => {
    res.redirect(buildMyUrl );
    
});

app.get('/list', async (req, res) => {
    const accessToken = tokenData.access_token; // Retrieve stored access token
    const requestOptions = {
     method: 'GET',
      headers: {
        "Authorization":`Bearer ${accessToken}`,
        "x-api-key": apitoken,
      },
    };
  
    try {
        const response = await fetch('https://openapi.etsy.com/v3/application/listings/active', requestOptions);
        //waith for two seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (response.ok) {
            const listings = await response.json(); 
            

          
            res.send(listings); 
        } else {
            
            res.send("Request failed with status: " + response.status);
        }
    } catch (error) {
        
        res.send(error);
    }
  });


const clientID = apitoken;
const clientVerifier = codeVerifier;
const redirectUri = "http://localhost:3000/callback";

app.get("/callback", async (req, res) => {
    
    const authCode = req.query.code;
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: clientID,
            redirect_uri: redirectUri,
            code: authCode,
            scope: 'listings_r', 
            code_verifier: clientVerifier,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(tokenUrl, requestOptions);

     
        if (response.ok) {
            tokenData = await response.json(); 
            res.send(tokenData);
        } else {
            res.send(response.statusText);
        }
    } catch (error) {
        res.send(error);
    }
});



app.listen(port, () => {
    console.log(`sellerkin listening at... ${baseurl}`);
});