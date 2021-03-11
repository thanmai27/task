const mongoose = require('mongoose');

const Schema = mongoose.Schema
 
const employeeSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  msEmail: {
    type: String,
    required: true
  },
  fbEmail: {
    type: String,
    required: false
  },
  
})
module.exports = mongoose.model('Employee', employeeSchema)
