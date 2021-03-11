const string = require('joi/lib/types/string');
const { data } = require('jquery');
const mongoose = require('mongoose');
const Employee = require('../models/employee')

const Schema = mongoose.Schema
 
const logSchema = new Schema({
  email:{
    type:String,
    required:true,
  },
  employeeId:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:'Employee'
  },
  userName: {
    type: String,
    required: true
  },
  loggedInAt: {
    type: Date,
    required: true,
  },
  mode:{
    type: String,
    required: true
  },
  loggedOutAt: {
    type: Date,
    required: false,
  },
})
module.exports = mongoose.model('Log', logSchema)
