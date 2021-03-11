const mongoose = require('mongoose');

var Task = mongoose.model('Task', {
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
    taskName:{type:String}

});

module.exports = { Task };
