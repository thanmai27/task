const mongoose = require('mongoose');

const Schema = mongoose.Schema
 
const credentialSchema = new Schema({
    msClientId:{
        type:String,
        required:true
    },
    msAuthority:{
        type:String,
        required:true
    },
    RedirectUri:{
        type:String,
        required:true
    },
    msClientSecret:{
        type:String,
        required:true
    },
    msScopes:[{
        type:String,
        required:true
    }],
    fbClientId:{
        type:Number,
        required:true
    },
    fbAppSecret:{
        type:String,
        required:true
    },
    fbScope:{
        type:String,
        required:true
    },
    secret:{
        type:String,
        required:true
    } 
})
module.exports = mongoose.model('Credentials', credentialSchema)
