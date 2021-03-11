const mongoose = require('mongoose');

var Taskdemo = mongoose.model('Taskdemo', {
    projectName: { type: String },
    teamMember: { type: String },
    createdBy:{type:String},
    modifiedBy:{type:String},
    taskStatus: { type: String },
    createdOn: { type: Date },
    assignOn:{ type: Date },
    startOn: { type: Date },
    holdOn:{type:Date},
    endOn: { type: Date },
    cancelledOn:{type:Date},
    cancelReason:{type:String},
    taskName:{type:String},
    statusList:[String]

});

module.exports = { Taskdemo };