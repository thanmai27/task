const mongoose = require('mongoose');

var Taskchanges = mongoose.model('Taskchanges', {
    taskId: { type: String },
    state: { type: String },
    Date:{type:Date},
    currentStatus: { type: String },
    modifiedBy: { type:String},
    modifiedOn:{ type: Date },
   

});

module.exports = { Taskchanges };
