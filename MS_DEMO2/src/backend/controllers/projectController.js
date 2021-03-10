const express = require('express');
var router = express.Router();
// const Joi = require('joi');
var ObjectId = require('mongoose').Types.ObjectId;

var { User } = require('../models/user');
var { Project } = require('../models/project');


let user;
async function validate_Project(Project) {
    try {
        let project = {

            projectName: Joi.string().required(),
            projectState: Joi.string().required(),
            projectLead: Joi.string().required(),
            createdOn: Joi.date(),
            selectDate: Joi.date(),
            projectMembers: Joi.array(),
            ismap: Joi.boolean()


        }

        return Joi.validate(Project, project);

    } catch (ex) {
        res.status(400).send(ex.message)
    }

}


router.get('/totalprojects', async(req, res) => {
    await Project.find().countDocuments(function(err, doc){
        console.log("Number of docs: ", doc );
        if(!err)
        {
    console.log(doc);
    res.json(doc)
        }
        else
        {
            res.send(err);
    
        }
    });
    })
router.post('/', async(req, res) => {
    const { error } = validate_Project(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);

    }

    let project = await Project.findOne({ projectName: req.body.projectName });
    //let choose = await Project.find({ ismap: 1, projectState: 'stared' })
    if (project) {
        return res.status(400).send("Project is already exist");
    }
   
    

    project = new Project({
        projectName: req.body.projectName,
        projectState: "created",
        projectLead: req.body.projectLead == undefined || '' ? null : req.body.projectLead,
        createdOn: Date.now(),
        selectDate: Date.now(),
        projectMembers: req.body.projectMembers,
        ismap: false


    });
    if (!error) {
        await project.save();
    }

    res.send(project);

})



router.get('/', async(req, res) => {
    await Project.find((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send("Cannot get Details");

        }
    })


})

router.get('/find/:name', async(req, res) => {
    await Project.find( {projectName:req.params.name},(err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send("Cannot get Details");

        }
    })


})



router.get('/ismap', async(req, res) => {


    let users = await User.find({ role: 'Team Lead' }, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send("Cannot get Details");

        }  

        console.log(users);
    })


})

router.get('/:id', async(req, res) => {
    await Project.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400).send(req.params.id + " " + " is Invalid Id...")

        }
    })



})




router.put('/:id',async (req, res) => {
    
    try {
        // let memberName;
        console.log('Sashank', req.body.projectLead);
        let membersArray = [];
        let membr,lead;
        let project;
        let members = req.body.projectMembers;
        let leads =  req.body.projectLead;
        let temp, temp2;
        let selection = req.body.usrSelection;
        if(leads.length != 0){
            // for (let i = 0; i < leads.length; i++) {
                let n = await User.findById({ _id: leads }); //, (err, doc) => {
                console.log('Tis  is user data ', n);
                lead = {
                    UserId: n._id,
                    name: n.name
                }
                // membersArray.push(membr);
                if(req.body.ismap == true){
                    // console.log(x.members[i].UserId);
                    response = await User.findByIdAndUpdate({ _id: n._id }, { $set: { "isactive": true } }) //.then(ress => {
                    temp = response;
                    // console.log('this is response 1',response);
                }else{
                    // console.log(x.projectMembers[i].UserId);
                    response = await User.findByIdAndUpdate({ _id: n._id }, { $set: { "isactive": false } }) //.then(ress => {
                    temp = response;
                    console.log('this is response 2',response);

                }
            
            // }
        }
        console.log('Members avaleu', members);
        if (members.length != 0) {
            console.log(members);
            for (let i = 0; i < members.length; i++) {
                console.log('Members', members[i]);
                let x = await User.findById({ _id: members[i] }); //, (err, doc) => {
                 console.log('Thsi is x value ', x);
                membr = {
                    UserId: x._id,
                    name: x.name
                }
                membersArray.push(membr);
                console.log('Thsi is members array ',membersArray);
                if(req.body.ismap == true){
                    // console.log(x.members[i].UserId);
                    response = await User.findByIdAndUpdate({ _id: x._id }, { $set: { "isactive": true } }) //.then(ress => {
                    temp2 = response;
                    // console.log('Resp', selection);
                    for(let j =0; j< selection.length; j++){
                    // console.log('This is internal Select' , selection[j].isSelected);
                        if(selection[j].isSelected == false){
                            console.log(selection[j].usrId);
                            response = await User.findByIdAndUpdate({ _id: selection[i].usrId }, { $set: { "isactive": false } }) //.then(ress => {
                                temp2 = response;  
                                // console.log('This is internal Select ',response);
                    console.log('this is response 3',response);

                        }
                    }
                       
                }else{
                    // console.log(x.projectMembers[i].UserId);
                    response = await User.findByIdAndUpdate({ _id: x._id }, { $set: { "isactive": false } }) //.then(ress => {
                        temp2 = response;
                    console.log('this is response 4',response);

                }
                
            }
            
        }
        project = {
            projectName: req.body.projectName,
            projectState: req.body.projectState,
            selectDate: Date.now(),
            projectLead: lead, // req.body.projectLead,
            projectMembers: membersArray,
            ismap: req.body.ismap
        };
        Project.findByIdAndUpdate(req.params.id, { $set: project }, { new: true })
            .then(result => {
                res.send(result)
            })
            .catch(err => {
             console.log(err);
                res.status(400).send(err)
            })
    }
    catch (error) {
        console.log(error);
    }

});


// router.put('/ismap/:id', async (req, res) => {
//     let temp;
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`Match not found:${req.params.id}`);
//     var user = {
//         ismap: true
//     }

//     let x = await Project.findById({ _id: req.params.id });
//     let val = x.projectMembers
//     x.ismap = !!user;
//     x.selectDate = Date.now()
//     x.save();
//     for (let i = 0; i < val.length; i++) {
//         console.log(x.projectMembers[i].UserId);
//        let y =  await User.findByIdAndUpdate({ _id: x.projectMembers[i].UserId }, { $set: { "isactive": true } }) //.then(ress => {
//             console.log(y);
//             temp = y;
//     }
//     res.json(temp)
// })

// router.put('/isunmap/:id',async (req, res) => {
//     let temp;
//     let temp2;
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`Match not found:${req.params.id}`);

//     await Project.findByIdAndUpdate({ _id: req.params.id}, { $set: { "ismap": false }  }).then( ress =>{
//         temp2 = ress;
//     }).catch(err =>{
//         console.log(err);
//     });
//     let val = temp2.projectMembers
//     console.log(temp2.ismap);

//     for (let i = 0; i < val.length; i++) {
//        let y =  await User.findByIdAndUpdate({ _id: temp2.projectMembers[i].UserId }, { $set: { "isactive": false } }) 
//             temp = y;
//     }
//     res.json(temp)
// })
module.exports = router;
