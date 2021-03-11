const express = require('express');
var router = express.Router();
const Joi = require('joi');
var ObjectId = require('mongoose').Types.ObjectId;

var Employee = require('../models/employee');


let user;
async function validate_Employee(Employee) {
    try {
        let employee = {
            name:Joi.string().require(),
            msEmail: Joi.string().required(),
            fbEmail: Joi.string(),

        }

        return Joi.validate(Employee, employee);

    } catch (ex) {
        return Joi.validate(ex.message)
    }

}


router.post('/', async(req, res) => {
    const { error } = validate_Employee(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);

    }

    let employee = await Employee.findOne({ msEmail: req.body.msEmail });
    //let choose = await Project.find({ ismap: 1, projectState: 'stared' })
    if (employee) {
        return res.status(400).send("Email is already exist");
    }

    employee = new Employee({
        name:req.body.name,
        msEmail: req.body.msEmail,
        fbEmail: req.body.fbEmail
    });

    if (!error) {
        await employee.save();
    }

    res.send(employee);

})


router.get('/', async(req, res) => {
    await Employee.find((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send("Cannot get Details");
        }
    })
})


router.get('/:id', async(req, res) => {
    await Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send(req.params.id + " " + " is Invalid Id...")

        }
    })
})




module.exports = router;
