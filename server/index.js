const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
app.use(cors());


async function startServer() {
  try {
    let tokenData = "";

    const port = 3000;
    const baseurl = `https://seller-kin-task1-server.vercel.app`;
    // const baseurl = `http://localhost:${port}`;
    dotenv.config();
    const apitoken = process.env.API_TOKEN;
    const contexts = "listings_r";

    const base64URLEncode = (str) =>
      str
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

    const sha256 = (buffer) =>
      crypto.createHash("sha256").update(buffer).digest();

    const codeVerifier = base64URLEncode(crypto.randomBytes(32));

    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const state = Math.random().toString(36).substring(7);

    const buildMyUrl = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${baseurl}/callback&scope=${contexts}&client_id=${apitoken}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    app.get("/ping", async (req, res) => {
      const requestOptions = {
        method: "GET",
        headers: {
          "x-api-key": apitoken,
        },
      };

      const response = await fetch(
        "https://api.etsy.com/v3/application/openapi-ping",
        requestOptions
      );

      if (response.ok) {
        const data = await response.json();
        res.send(data);
      } else {
        res.send("oops");
      }
    });

    app.get("/auth", async (req, res) => {
      res.redirect(`${baseurl}/`);
    });

    app.get("/", async (req, res) => {
      res.redirect(buildMyUrl);
    });

    app.get("/list", async (req, res) => {
      const accessToken = tokenData.access_token
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": apitoken,
        },
      };

      try {
        const response = await fetch(
          "https://openapi.etsy.com/v3/application/listings/active",
          requestOptions
        );
        //waith for two seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (response.ok) {
          const listings = await response.json();
          res.status(200).json(listings); 
        } else {
          const errorData = await response.json(); 
          const errorMessage = errorData.message || "Request failed"; 
          res.status(response.status).json({ error: errorMessage }); 
        }
      } catch (error) {
        res.send(error);
      }
    });

    app.get("/images", async (req, res) => {
      const { id } = req.query; 
      const accessToken = tokenData.access_token; 
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": apitoken,
        },
      };

      try {
        const response = await fetch(
          `https://openapi.etsy.com/v3/application/listings/${id}/images`,
          requestOptions
        );
        if (response.ok) {
          const listings = await response.json();
          res.status(200).json(listings); 
        } else {
          const errorData = await response.json(); 
          const errorMessage = errorData.message || "Request failed"; 
          res.status(response.status).json({ error: errorMessage })
        }
      } catch (error) {
        res.status(500).json({ error: "Internal server error" }); 
      }
    });

    app.get("/economic", async (req, res) => {
      const { id } = req.query; 
      const accessToken = tokenData.access_token; 
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": apitoken,
        },
      };

      try {
        const response = await fetch(
          `https://openapi.etsy.com/v3/application/listings/${id}`,
          requestOptions
        );
        if (response.ok) {
          const listings = await response.json();
          res.status(200).json(listings); 
        } else {
          const errorData = await response.json(); 
          const errorMessage = errorData.message || "Request failed"; 
          res.status(response.status).json({ error: errorMessage });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    const clientID = apitoken;
    const clientVerifier = codeVerifier;
    const redirectUri = `${baseurl}/callback`;

    app.get("/callback", async (req, res) => {
      const authCode = req.query.code;
      const tokenUrl = "https://api.etsy.com/v3/public/oauth/token";
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: clientID,
          redirect_uri: redirectUri,
          code: authCode,
          scope: "listings_r",
          code_verifier: clientVerifier,
        }),
        headers: {
          "Content-Type": "application/json",
        },
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

    const sendRequestToEndpoint = async () => {
      try {
        const response = await fetch(`${baseurl}/list`);
        if (response.ok) {
          const data = await response.json();
          console.log("Request sent successfully!", data);
        } else {
          console.error("Failed to send request.");
        }
      } catch (error) {
        console.error("Error sending request:", error);
      }
    };

    
    const intervalId = setInterval(sendRequestToEndpoint, 20 * 60 * 1000);

    
    process.on("SIGINT", () => {
      clearInterval(intervalId);
      process.exit(0);
    });

    app.listen(port, () => {
      console.log(`sellerkin listening at... ${baseurl}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
