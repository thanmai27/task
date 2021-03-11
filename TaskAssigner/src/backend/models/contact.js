const mongoose = require('mongoose');

var Contact = mongoose.model('Contact',
{
    type: { type: String,required:true },
    severity: { type: String,required:true },
    subject: { type: String,required:true },
    description: { type:String,required:true},
    modeofcontact:{ type: String,required:true },
    email:{ type: String },
    cc:{ type: String },
    contact:{type:Number},
    attachment:{type:String},


});

module.exports = { Contact};
