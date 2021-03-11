const express = require('express');
var router = express.Router();
const axios = require('axios');
require('dotenv').config()
const accessTokens = new Set();
 
// const corsOption = {
//     origin: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
// };
// app.use(cors(corsOption));

const config = {
  auth: {
    clientId: 257662269101239,
    appSecret: '7c45af0b41e2934796784b8490b7a500',
    redirectUri: 'http://localhost:4200/verify',
    scope: 'public_profile,email'
  }
};
//  router.get('/fblogin', (req, res) => {
//    res.redirect('https://www.facebook.com/v9.0/dialog/oauth?client_id='+ config.auth.clientId +'&redirect_uri='+ config.auth.redirectUri +'&scope=public_profile,email')
//   })
  
  router.post('/oauth-redirect', (req, res) => {
      const authCode = req.body.Code;
        
    //   console.log("code is",authCode)
 
      const accessTokenUrl = 'https://graph.facebook.com/v9.0/oauth/access_token?' +
        `client_id=` +config.auth.clientId +
        `&client_secret=` +config.auth.appSecret +
        `&redirect_uri=` + config.auth.redirectUri +
        `&code=` + authCode;
  
      // Make an API request to exchange `authCode` for an access token
      const accessToken = axios.get(accessTokenUrl).then(ress =>{
      var resultToken = ress.data['access_token']
      console.log('Access token is.................',resultToken);
      accessTokens.add(resultToken);
    //   const detailsUrl = `/fb/me?accessToken=${encodeURIComponent(resultToken)}`;

    //   const accessToken = req.query.accessToken;
    //   console.log();
      if (!accessTokens.has(resultToken)) {
        throw new Error(`Invalid access token "${resultToken}"`);
      }
  
      // Get the name and user id of the Facebook user associated with the
      // access token.
      axios.get(`https://graph.facebook.com/me?access_token=${encodeURIComponent(resultToken)}&fields=id,name,first_name,last_name,email,gender`)
      .then((data) =>{
        console.log(data.data.email);
        res.json(data.data);
      }).catch((err) =>{
        res.json({msg : err})
      })
      
    //   console.log(detailsUrl);
    //   res.redirect(detailsUrl);
      } )
      // Store the token in memory 
       
      
    //   axios.get(detailsUrl).then((result) => {
    //     console.log(result);
    //   }).catch((err)=>{
    //     console.log(err);
    //   });
    
      
  })
 
//   router.get('/me',(req, res) => {
//     try {
//       const accessToken = req.query.accessToken;
//       console.log();
//       if (!accessTokens.has(accessToken)) {
//         throw new Error(`Invalid access token "${accessToken}"`);
//       }
  
//       // Get the name and user id of the Facebook user associated with the
//       // access token.
//       const data = axios.get(`https://graph.facebook.com/me?access_token=${encodeURIComponent(accessToken)}&fields=id,name,first_name,last_name,email,gender`);
      
//       res.json(data);

//     } catch (err) {
//       console.log("Error is :",err.message);
//       res.status(500).json({ message: err.response.data || err.message });
//     }
//   })
 
 module.exports = router; 
 
