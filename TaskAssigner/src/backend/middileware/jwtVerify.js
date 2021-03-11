const env = require('dotenv').config()
 
const jwt = require('jsonwebtoken');
 
module.exports = (req,res, next) =>{
    const token = req.headers.authorization.split(" ")[1];
    
    //  console.log(req.headers.authorization)
 
    //  console.log("middleware verify",token);
    if(!token){
        console.log('Access Denied');
        return res.send('Access Denied')
    }
    try{
      const verified = jwt.verify(token, 'Scary-Cat') 
      req.doc = verified;
      next();
    }catch(err){
        console.log('Invalid Token');
        res.send('Invalid Token');
    }
}