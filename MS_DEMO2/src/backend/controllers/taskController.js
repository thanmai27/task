const express = require('express');
var router = express.Router();
const Joi = require('joi');
var ObjectId = require('mongoose').Types.ObjectId;

var { User } = require('../models/user');
var { Project } = require('../models/project');
var { Task } = require('../models/task');
var { Taskchanges } = require('../models/taskchanges');



async function validate_Task(Task) {
    try {
        let task = {

            projectName: Joi.string(),
            teamMember: Joi.string(),
            createdBy:Joi.string(),
            taskStatus: Joi.string(),
            createdOn: Joi.date(),
            assignOn:Joi.date(),
            startOn: Joi.date(),
            holdOn:Joi.date(),
            endOn: Joi.date(),
            cancelledOn:Joi.date(),
            taskName:Joi.string(),


        }

        return Joi. validate_Task(Task, task);

    } catch (ex) {
        console.log(ex.message)
    }

}



router.get('/', async(req, res) => {
    await Task.find((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send("Cannot get DEatils");

        }
    }).sort({_id:-1}) 


})


router.get('/changes', async(req, res) => {
    await Taskchanges.find((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send("Cannot get DEatils");

        }
    }).sort({taskId:-1})


})


router.get('/:id', async(req, res) => {
    await Task.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send(req.params.id + " " + " is Invalid Id...")

        }
    })



})

router.get('/changes/:taskId', async(req, res) => {
    await Taskchanges.find({taskId:req.params.taskId}, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send(req.params.taskId + " " + " is Invalid Id...")

        }
    })



})



// router.post('/', async(req, res) => {

//     const { error } = validate_Task(req.body);
//     if (error) {
//         res.status(400).send(error.details[0].message);

//     }


//     let task = new Task({
//         projectName: req.body.projectName,
//         teamMember: req.body.teamMember,
//         createdBy: req.body.createdBy,
//         modifiedBy:req.body.modifiedBy== undefined||'' ? null :req.body.modifiedBy,
//         taskStatus: req.body.taskStatus,
//         createdOn: Date.now(),
//         assignOn:req.body.assignOn== undefined||'' ? null :req.body.assignOn,
//         startOn: req.body.startOn== undefined||'' ? null : req.body.startOn ,
//         holdOn: req.body.holdOn== undefined||'' ? null : req.body.holdOn,
//         endOn: req.body.endOn== undefined||'' ? null :req.body.endOn ,
//         cancelledOn: req.body.cancelledOn== undefined||'' ? null : req.body.cancelledOn,
//         taskName:req.body.taskName


//     });


//     let taskchane = new Taskchanges(
//         {
//             taskId:task._id,
//             state:task.taskStatus,
//             Date:Date.now(),
//             currentStatus:"NA",
//             modifiedBy: "NA",
//             modifiedOn:Date.now(),

//         }
        


//     )

    
//     if (!error)
//      {
//         await task.save();
//         res.send(task);
//         taskchane.save();

//     } else 
//     {
//         res.status(404).send("Failed to send data")
//     }


// })


router.post('/', async(req, res) => {

  
try
{

    let task = new Task({
        projectName: req.body.projectName,
        teamMember: req.body.teamMember,
        createdBy: req.body.createdBy,
        modifiedBy:req.body.modifiedBy== undefined||'' ? null :req.body.modifiedBy,
        taskStatus: req.body.taskStatus,
        createdOn: Date.now(),
        assignOn:req.body.assignOn== undefined ||''? null :req.body.assignOn,
        startOn: req.body.startOn== undefined||'' ? null : req.body.startOn ,
        holdOn: req.body.holdOn== undefined||'' ? null : req.body.holdOn,
        endOn: req.body.endOn== undefined||'' ? null :req.body.endOn ,
        cancelledOn: req.body.cancelledOn== undefined||'' ? null : req.body.cancelledOn,
        taskName:req.body.taskName


    });


    let taskchane = new Taskchanges(
        {
            taskId:task._id,
            state:task.taskStatus,
            Date:Date.now(),
            currentStatus:"NA",
            modifiedBy: "NA",
            modifiedOn:Date.now(),

        })
        if(task.assignOn==null&&task.startOn!=null)
        {
            res.status(400).send("You cannot set start date without assign date");
            console.log(task.assignOn,task.startOn)

        }
        else if(task.assignOn!=null&&task.taskStatus=="Assign")
        {
            console.log("Cannot assign date again")
            res.status(400).send("Cannot assign date again")

        }
        else if(Date.parse(task.assignOn)>Date.parse(task.startOn))
        {
            console.log("start date must be greater than assign Date")
            res.status(400).send("start date must be greater than assign date")

        }

        else if(Date.parse(task.assignOn)>Date.parse(task.endOn))
        {
            console.log("EndDate must be greater than Assign Date")
            res.status(400).send("end date must be greater than assign date")
        }
        
        else if(Date.parse(task.startOn)>Date.parse(task.endOn))
        {
            console.log("EndDate must be greater than Start Date")
            res.status(400).send("end date must be greater than  start date")
        }

        else if(Date.parse(task.holdOn)<Date.parse(task.assignOn))
        {
            console.log("ON hold Date must be greater than Assign Date")
            res.status(400).send("ON hold Date must be greater than Assign Date");
        }
        else if(Date.parse(task.cancelledOn)<Date.parse(task.assignOn))
        {
            console.log("Cancelled Date must be greater than Assign Date")
            res.status(400).send("Cancelled Date must be greater than Assign Date");
        }
        else if(Date.parse(task.cancelledOn)<=Date.parse(task.startOn))
        {
            console.log("Cancelled Date must be greater than or equall to  Start Date")
            res.status(400).send("Cancelled Date must be greater than or equall to  Start Date");
        }
   

        else if(task.taskStatus=="Completed"&&task.assignOn==null&&task.startOn==null)
            {
                res.status(400).send("Start date and Assign date are required")
            }

     
            
        else
            {
                    await task.save();
                    res.send(task);
                    taskchane.save();
            }
      
      
      
}
catch (error) {
    console.log(error);
}   

})


router.put('/:id', (req, res) => {

    
    try {

        
        let task = {
            projectName: req.body.projectName,
            teamMember: req.body.teamMember,
            createdBy: req.body.createdBy,
            modifiedBy:req.body.modifiedBy,
            taskStatus: req.body.taskStatus,
            assignOn:req.body.assignOn,
            startOn: req.body.startOn== undefined||'' ? null : req.body.startOn ,
            holdOn:req.body.holdOn,
            endOn: req.body.endOn== undefined||'' ? null :req.body.endOn ,
            cancelledOn: req.body.cancelledOn== undefined||'' ? null : req.body.cancelledOn,

            taskName:req.body.taskName


        };

    
        
    let taskchane = new Taskchanges(
        {
            taskId:req.params.id,
            state:task.taskStatus,
            Date:Date.now(),
            currentStatus:"Running",
            modifiedBy: task.modifiedBy,
            modifiedOn:Date.now(),

        } );

       // const { error} =  checkDate(task.assignOn,task.startOn);
      if(task.taskStatus=="Queue")
      {
        res.status(400).send("You are not modify any data")

      }
         if(Date.parse(task.assignOn)>Date.parse(task.startOn))
        {
            console.log("start date must be greater than assign Date")
            res.status(400).send("start date must be greater than assign date")

        }

        else if(Date.parse(task.assignOn)>Date.parse(task.endOn))
        {
            console.log("EndDate must be greater than Assign Date")
            res.status(400).send("end date must be greater than assign date")
        }
        
        else if(Date.parse(task.startOn)>Date.parse(task.endOn))
        {
            console.log("EndDate must be greater than Start Date")
            res.status(400).send("end date must be greater than  start date")
        }

        else if(Date.parse(task.holdOn)<Date.parse(task.assignOn))
        {
            console.log("ON hold Date must be greater than Assig Date")
            res.status(400).send("ON hold Date must be greater than Assig Date");
        }
        else if(Date.parse(task.cancelledOn)<Date.parse(task.assignOn))
        {
            console.log("Cancelled Date must be greater than Assign Date")
            res.status(400).send("Cancelled Date must be greater than Assign Date");
        }
        else if(Date.parse(task.cancelledOn)<Date.parse(task.startOn))
        {
            console.log("Cancelled Date must be greater than or equall to  Start Date")
            res.status(400).send("Cancelled Date must be greater than   Start Date");
        }
        else if(task.assignOn == null&&task.startOn!==null)
        {
            console.log("Start Date is not allowed without Assign Date")
            res.status(400).send("Start Date is not allowed without Assign Date")
        }
       
        else if(task.assignOn == null&&task.endOn!==null)
        {
            console.log("End Date is not allowed without Assign Date")
            res.status(400).send("End Date is not allowed without Assign Date")
        }
        else if(task.startOn == null&&task.endOn!==null)
        {
            console.log("EndDate must be greater than Start Date")
            res.status(400).send("End Date is not allowed without Start Date")
        }
        else if(task.startOn!=null&&task.taskStatus=="Assign")
        {
            console.log("Cannot assign date again")
            res.status(400).send("Assign date is already exist ");

        }
        else if(task.assignOn==null&&task.startOn==null&&task.taskStatus=="Started")
        {
            res.status(400).send("Assign date is required");

        }
        else if(task.assignOn==null&&task.taskStatus=="Cancelled")
        {
            res.status(400).send("Assign date is required ");

        }
        else
        {
            Task.findByIdAndUpdate(req.params.id, { $set: task }, { new: true })
            .then(result =>
                {
                    res.send(result)
                } )
            .catch(err => res.status(400).send(err))

             taskchane.save();


        }

    // if(!error)
    // {
    //     Task.findByIdAndUpdate(req.params.id, { $set: task }, { new: true })
    //     .then(result =>
    //         {
    //             res.send(result)
    //         } )
    //     .catch(err => res.status(400).send(err))
    // }
   
  
    } catch (error) {
        console.log(error);
    }


});


module.exports = router;