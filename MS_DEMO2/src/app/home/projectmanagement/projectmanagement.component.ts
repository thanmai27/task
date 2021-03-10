import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';



import { Project } from 'src/app/model/project.model';
import { ProjectmanagementService } from 'src/app/shared/projectmanagement.service';
import { UserManagementService } from 'src/app/shared/user-management.service';
import { User } from 'src/app/shared/usermanagement.model';
export const EDIT="edit";
export const MAP="map";
@Component({
  selector: 'app-projectmanagement',
  templateUrl: './projectmanagement.component.html',
  styleUrls: ['./projectmanagement.component.css']
})
export class ProjectmanagementComponent implements OnInit {
msg;
show=false;
hide=false;
view=false;
currentDate:Date;
prjMmbrDrpDwnBind;
users:User[];
project:Project[];
teamlead:[]=[];
member;
arr:any = [];
dtOptions: DataTables.Settings = {};

teamMemberlist =[];
uId:any;
isChecked:any;

//multi-dropdown
dropdownList :any= [];
selectedItems = [];
dropdownSettings = {};



projectmodel = new Project();
usermodel = new User();
isEditOrMap:boolean=false;
constructor(public userService: UserManagementService,public projectService:ProjectmanagementService,private toastr: ToastrService) { }

  ngOnInit()
  {
      
    setTimeout(function(){
      $('table').DataTable( {
      responsive: true,
      "lengthMenu": [5, 10, 25,50]
      } );
      }, 100);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true

    }

    this.fn_ResetForm()
  this.fn_RefreshProjectList();
  this.Fn_refreshUserList();

  }

  // fn_AssignExistienceProjectMember(type,Project){
  //   try{
  //     //setTimeout(()=>{
  //       this.userService.users.forEach(obj => {
  //         let value= this.projectService.projects.filter(ele=>((ele.projectLead||ele.projectMembers)==obj.name || ele.projectMembers.includes(obj.name)) && ele.projectState =="started")

  //       if(type && type==MAP ){
  //         if(value && value.length!=0){
  //           obj.isExisitngMember = true;
  //         }else{
  //           obj.isExisitngMember = false;
  //         }
  //         obj.enableOrDisable=false;

  //       }else{
  //         //if(value && value.length!=0 ){
  //           let value1= this.projectService.projects.filter(ele=>((ele.projectLead||ele.projectMembers)==obj.name || ele.projectMembers.includes(obj.name))&& ele.projectState =="started" &&ele.projectName==Project.projectName);
  //           if(value1.length==0){
  //             obj.enableOrDisable=true;

  //           }else{
  //             obj.enableOrDisable=false;
  //           }
  //         // }
  //         obj.isExisitngMember = false;
  //       }



  //       });
  //    // },1000)
  //   }catch(e){
  //     console.log(e)
  //   }
   


  // }


  fn_AssignExistienceProjectMember(type,Project){


  // this.userService.users.filter((obj) => {console.log(this.projectService.projects[1].projectMembers.includes(obj.name))})
  this.projectService.projects.filter((ele)=>{console.log(ele)});
  
  this.userService.users.forEach((obj)=>{console.log(obj.name,obj._id)})


// for(let i=0;i<this.userService.users.length;i++)
// {
//  let  p = this.userService.users[i]._id;
//  let q;

//     for(let j=0;j<this.projectService.projects.length;j++)
//     {
//       q = this.projectService.projects[j].projectLead[0];
//       console.log("asddsad",q.name,q.UserId);

//       if(q.UserId==p)
//       {
//         console.log(true);
//         this.usermodel.isExisitngMember = true;
//         this.usermodel.enableOrDisable=false;

        
//       }
      
//     }
// }
  }
  fn_ResetForm(form?:NgForm)
{
  if(form)
  form.reset()
    this.projectmodel = {
      _id:"",
      projectName:"",
      projectState:"",
      createdOn:null,
      selectDate:null,
      projectLead:null,
      projectMembers:[],
      ismap:false,
      usrSelection:[]
      // usrId:'',
      // isSelected:false

    }

  this.fn_RefreshProjectList();
  $("#hide_content").hide();
}

  fn_RefreshProjectList() {
    this.projectService.getProjectList().subscribe((res) => {
      this.projectService.projects = res as Project[];

    });
  }
  Fn_refreshUserList() {
    this.userService.getUserList().subscribe((res) => {
      this.userService.users = res as User[];
      //console.log("User refresh",res)

    });
  }
  Fn_AddUser()
  {
    setTimeout(()=>{      window.scrollTo(0, 500);    },100)

    this.fn_ResetForm();
    $("#show_content").click(function () {
      $("#hide_content,#table-content").show();
    })
    this.show = true;
    this.hide =  false;
    this.view = false;


  }
  fn_Save(form: NgForm,uId,checked)
  {
    // let arr:any=[];

    if(form.value.projectState == "started")
    {
      this.projectmodel.ismap = true;
      // console.log(this.projectmodel)
    }
    else
    {
      this.projectmodel.ismap = false;
      // console.log(this.projectmodel)
    }

// console.log(this.uId,this.isChecked);
    
    


    if (form.value._id == undefined || form.value._id == '' )
    {

      this.projectmodel = form.value;
      // this.projectmodel.isSelected = this.isChecked;
      // this.projectmodel.usrId = this.uId;
      this.projectmodel.usrSelection = this.arr;

      console.log("Project",  this.projectmodel);

      this.projectService.postProject( this.projectmodel).subscribe((data) => {
        this.fn_ResetForm();
        this.arr = [];
        this.fn_RefreshProjectList();
        console.log("The data is", data);
        this.toastr.success("Project Added Successguuly", "Your Request has sent !!!",
          {
            timeOut: 2000,
            progressAnimation: 'increasing',

          })
          $("#hide_content").hide();


          // window.location.reload();

      }, (error) => {
        this.msg = JSON.stringify(error.error);
        this.toastr.error(this.msg,"Error",
          {
            timeOut: 2000
          })
      });
    }
    else
    {
       

        this.projectmodel.selectDate = this.currentDate;
        this.projectmodel.usrSelection = this.arr;
        // this.projectmodel.isSelected = this.isChecked;
        // this.projectmodel.usrId = this.uId;
        console.log("Project",  this.projectmodel);
        this.projectService.putProject( this.projectmodel).subscribe((res) => {
          // console.log(res);
          this.fn_RefreshProjectList();
          $("#hide_content").hide();

          this.toastr.success("Data Updated Successguuly", "Your Request has sent !!!",
            {
              timeOut: 2000,
              progressAnimation: 'increasing',

            })
            this.fn_ResetForm();
            this.arr = [];
            this.fn_RefreshProjectList();
        },
          (error) => {
            this.msg = JSON.stringify(error.error);
            this.toastr.error("Error", this.msg,
              {
                timeOut: 4000
              })
          });



    }



  }
fn_Cancel()
{
this.show = false;
}

Fn_Member(event,opt)
{
console.log(opt.id + "," +opt.selected);
this.uId = opt.id;
this.isChecked=opt.selected;

// console.log("eveny",event);


let _model:any ={
  usrId: this.uId,
  isSelected: this.isChecked
};
// arr.push(_model);
 this.arr.push(_model);

 }


fn_Change(userId,userState)
{
  // this.currentDate = new Date();

  // debugger;
  // console.log(userId,userState)
  // if(userState=='started')
  // {
  //   this.projectService.isMap(userId).subscribe();

  // }
  // else
  // {
  //   this.projectService.isUnMap(userId).subscribe();

  // }

}

fn_Map(project:Project)
{
  setTimeout(()=>{      window.scrollTo(0, 500);    },100)

  debugger;
  // this.usermodel.isExisitngMember = false;
  this.isEditOrMap=false;
  this.fn_AssignExistienceProjectMember(MAP,project);

console.log("project map",project)
  this.projectmodel = project;

  this.hide=true;
  this.show = true;
  this.view= false;

  $("#hide_content").show();

}

fn_Edit(project:Project)
{
  setTimeout(()=>{      window.scrollTo(0, 500);    },100)

debugger
this.prjMmbrDrpDwnBind =project.projectMembers;

// console.log(this.prjMmbrDrpDwnBind);


  // this.usermodel.isExisitngMember = true;
  this.isEditOrMap=true;

  this.fn_AssignExistienceProjectMember(EDIT,project);

  this.projectmodel = project;


  this.hide=true;
  this.show = true;
  this.view= false;

  $("#hide_content").show();


}
fn_View(project:Project)
{
  setTimeout(()=>{      window.scrollTo(0, 500);    },100)

  this.projectmodel = project;

  this.hide=true;
  this.show = false;
  this.view=true;

  $("#hide_content").show();
  this.teamMemberlist =[];
  console.log(  this.projectmodel.projectMembers);
let members:any = this.projectmodel.projectMembers;
  for(let i=0;i<members.length;i++)
  {
    this.teamMemberlist.push(members[i].name);
    console.log(this.teamMemberlist);
    
  }
  



}



}

