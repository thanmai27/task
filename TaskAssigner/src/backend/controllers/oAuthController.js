const express = require("express");
const { mongoose } = require('../db');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const Log = require('../models/logs')
const msal = require('@azure/msal-node');
const Credential = require('../models/credential')
var router = express.Router();
const accessTokens = new Set();


let details = {};

router.get('/authCredentials/:mode', (req, res) => {
    let logMode = req.params.mode;
    Credential.findOne().then(cred => {
        // console.log(cred.msClientId);
        console.log("log btn value", logMode);
        if (logMode == 'MS') {
            const authMS = {
                clientId: cred.msClientId,// "e242d4d4-8831-4107-a2de-fe03469a13b3",
                authority: cred.msAuthority, // "https://login.microsoftonline.com/common",
                redirectUri: cred.RedirectUri,//'http://localhost:4200/verify',
                clientSecret: cred.msClientSecret,//"J93pvSx23WY57E-Z~ve2J7l75c8.0e3Bo~",
                scopes: cred.msScopes //['user.read', 'openid', 'profile']
            }
            res.json(authMS)
        } else {
            const authFB = {
                clientId: cred.fbClientId, //257662269101239,
                appSecret: cred.fbAppSecret, //'7c45af0b41e2934796784b8490b7a500',
                redirectUri: cred.RedirectUri,//'http://localhost:4200/verify',
                scope: cred.fbScope//'public_profile,email'
            }
            //  console.log(authFB);
            res.json(authFB)
        }
    });

})


//#region MSLogin

// const msConfig = {
//     auth: {
//         clientId: "e242d4d4-8831-4107-a2de-fe03469a13b3",
//         authority: "https://login.microsoftonline.com/common",
//         clientSecret: "J93pvSx23WY57E-Z~ve2J7l75c8.0e3Bo~"
//     },
//     system: {
//         loggerOptions: {
//             loggerCallback(loglevel, message, containsPii) {
//                 // console.log(message);
//             },
//             piiLoggingEnabled: false,
//             logLevel: msal.LogLevel.Verbose,
//         }
//     }
// };

// Create msal application object

router.post('/code', (req, res) => {
    console.log(req.body);
    Credential.findOne().then( ress =>{
        const msConfig = {
            auth: {
                clientId: ress.msClientId,//"e242d4d4-8831-4107-a2de-fe03469a13b3",
                authority: ress.msAuthority,//"https://login.microsoftonline.com/common",
                clientSecret: ress.msClientSecret//"J93pvSx23WY57E-Z~ve2J7l75c8.0e3Bo~"
            },
            system: {
                        loggerOptions: {
                            loggerCallback(loglevel, message, containsPii) {
                                // console.log(message);
                            },
                            piiLoggingEnabled: false,
                            logLevel: msal.LogLevel.Verbose,
                        }
                    }
        }
        let cca = new msal.ConfidentialClientApplication(msConfig);

        const tokenRequest = {
            code: req.body.Code,
            scope: "https://graph.microsoft.com/" + ress.msScopes[0] ,//User.Read",
            redirectUri: ress.RedirectUri//"http://localhost:4200/verify",
        };
        cca.acquireTokenByCode(tokenRequest).then((response) => {
            token = response.accessToken;
            // console.log("/nToken is.../n",token);
            axios.get("https://graph.microsoft.com/v1.0/me", {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
                .then((result) => {
                    // console.log(result.data)
                   Employee.findOne({ msEmail: result.data.mail }, (err, doc) => {
                        // console.log(doc)
    
                        if (doc) {
                            // console.log('Authenticated');
    
                            //log details
                            let logindetails = new Log({
                                employeeId: doc._id,
                                email: result.data.mail,
                                userName: result.data.displayName,
                                loggedInAt: Date.now(),
                                mode: 'MS',
                                loggedOutAt: null
                            });
    
                            logindetails.save().then(ress => {
                                console.log(ress);
    
                            });
                            const jwtToken = jwt.sign({ id: doc._id }, 'Scary-Cat');
                            // console.log("jwtToken...", jwtToken);
                            details =
                            {
                                jwt: jwtToken,
                                result: result.data
                            }
                            res.json(details);
    
    
                        }
                        else {
                            res.json({ message: 'You are not authenticated' })
                            // console.log("You are not authenticated");
    
                        }
                    })
                })
                .catch((reason) => {
                    // console.log("getUserProfile failed");
                    console.log(reason);
                })
    
        }).catch((error) => {
            console.log(error);
            res.status(500).send(error);
        })


    })

    
});


//#region FB Login
// const config = {
//     auth: {
//         clientId: 257662269101239,
//         appSecret: '7c45af0b41e2934796784b8490b7a500',
//         redirectUri: 'http://localhost:4200/verify',
//         scope: 'public_profile,email'
//     }
// };

router.post('/oauth-redirect', (req, res) => {
    const authCode = req.body.Code;

    Credential.findOne().then(cred => {
        const accessTokenUrl = 'https://graph.facebook.com/v9.0/oauth/access_token?' +
            `client_id=` + cred.fbClientId +
            `&client_secret=` + cred.fbAppSecret +
            `&redirect_uri=` + cred.RedirectUri +
            `&code=` + authCode;

        // Make an API request to exchange `authCode` for an access token
        const accessToken = axios.get(accessTokenUrl).then(ress => {
            var resultToken = ress.data['access_token']
            // console.log('Access token is.................', resultToken);
            accessTokens.add(resultToken);
            //   const detailsUrl = `/fb/me?accessToken=${encodeURIComponent(resultToken)}`;

            if (!accessTokens.has(resultToken)) {
                throw new Error(`Invalid access token "${resultToken}"`);
            }

            // Get the name and user id of the Facebook user associated with the
            // access token.
            axios.get(`https://graph.facebook.com/me?access_token=${encodeURIComponent(resultToken)}&fields=id,name,first_name,last_name,email,gender`)
                .then((result) => {
                    // console.log(result.data);
                    const mailID = Employee.findOne({ "fbEmail": result.data.email }, (err, doc) => {
                        // console.log(doc);

                        if (doc) {

                            // console.log(result.data);
                            //  res.redirect('http://localhost:4200/dashboard');
                            // console.log('Authenticated');
                            let logindetails = new Log({
                                email: result.data.email,
                                employeeId: doc._id,
                                userName: result.data.name,
                                loggedInAt: Date.now(),
                                mode: 'FB',//req.session.mode,
                                // loggedOutAt: null
                            });

                            logindetails.save().then(ress => {
                                console.log('Logs: ' + ress);
                            });
                            const jwtToken = jwt.sign({ id: doc._id }, 'Scary-Cat');
                            details =
                            {
                                jwt: jwtToken,
                                result: result.data
                            }
                            res.send(details);
                        }

                        else {
                            // console.log("You are not authenticated");
                            res.json({ message: 'You are not authenticated' })
                        }
                    })
                })
        })
    })
})

//#endregion


router.patch('/logout', (req, res) => {
    const email_Id = req.body.email;
    Log.findOne({ email: email_Id }).sort({ "loggedInAt": -1 })
        .then((result) => {
            result.loggedOutAt = Date.now();
            result.save()
            res.json(result)
            // console.log('This is the result : ' + result);
        }).catch((error) => {
            console.log(error);
            res.json({ message: 'No recent log registered' })
        })
});


module.exports = router;


