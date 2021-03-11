const mongoose = require('mongoose');

var Project = mongoose.model('Project', {
    projectName: { type: String, required: true },
    projectState: { type: String },
    projectLead: [],
    createdOn: { type: Date, default: Date.now },
    selectDate: { type: Date, default: Date.now },
    projectMembers: [],
    ismap: { type:Boolean }

});

module.exports = { Project };
