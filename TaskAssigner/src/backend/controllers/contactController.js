
require('dotenv').config();
const express = require('express');
var nodemailer = require('nodemailer');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' })
var router = express.Router();
// var ObjectId = require('mongoose').Types.ObjectId;

var { Contact } = require('../models/contact');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log("fieldname"+ "  "+ file.fieldname)
  }
})

var upload = multer({ storage: storage })

router.post('/',upload.single('attachment'), (req, res) => {
  console.log('YOOohoooo');
  let cnt = new Contact(
    {
      type: req.body.type,
      severity: req.body.severity,
      subject: req.body.subject,
      description: req.body.description,
      modeofcontact: req.body.modeofcontact,
      email: req.body.email,
      cc: req.body.cc,
      contact: req.body.contact,
      attachment: req.file.filename
    });
    // console.log(cnt);
  cnt.save()
    .then(result => {
      if (result.email != '') {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: 'thanmai1994@gmail.com',
            pass: '28042711'
          },
          tls: {
              rejectUnauthorized: false
           }
        });
        var mailOptions = {
          from: 'thanmai1994@gmail.com',
          to: result.email,
          subject: result.subject,
          html: `<h4>${result.description}</h4>`,
          attachments: [{
            filename: req.file.filename,
            path:req.file.path
          }]
        }
        transporter.sendMail(mailOptions, function (error, ress) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + JSON.stringify(ress));
          }
        });
      }

      else
      {
        console.log("No mail sent")
      }
      res.send(result)
     console.log(result);
    })
    .catch(err => {
      res.status(400).send(err)
      console.log(err);
    })
});
module.exports = router;
