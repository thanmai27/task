import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

import 'datatables.net';


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
  leadName:any;
  show=false;
  hide=false;
  view=false;
  addmem = false;
  currentDate:Date;
  users:User[];
  project:Project[];
  teamleadList:any=[];
  teammemberList:any=[];
  selectedMemberList:any =[];
  AddMemberList:any =[];
  arr:any = [];
  uId:any;
isChecked:any;
projectDate:any =[];


  teamleadoption:any;
  teamemberoption:any;
  member;
  // dtOptions: DataTables.Settings = {};
  
  //multi-dropdown
  dropdownList :any= [];
  selectedItems = [];
  dropdownSettings = {};
  btnValue:any;
  
  
  projectmodel = new Project();
  usermodel = new User();

  sidebar= $('.main-sidebar ').show();
Icon='fas fa-expand'
constructor(public userService: UserManagementService,public projectService:ProjectmanagementService,private toastr: ToastrService) { }

ngOnInit()
{
  $(document).attr("title", "TaskAssigner - Project");
  this.addmem = false;

  setTimeout(function () {
    $('tabledata').DataTable({
      responsive: true,

      "lengthMenu": [5, 10, 25, 50]
    });
  }, 100);



  this.fn_ResetForm()
this.fn_RefreshProjectList();
this.Fn_refreshUserList();

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
        ismap:null,
        usrSelection:[]
        // usrId:'',
        // isSelected:false,
  
      }
  
    this.fn_RefreshProjectList();
    $("#hide_content").hide();
  }

  fn_RefreshProjectList() {
    this.projectService.getProjectList().subscribe((res:any) => {
      
      this.projectService.projects = res ;
    // this.projectDate = res
      
    });
    console.log(  "    this.projectDate",  this.projectDate);
    
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
    this.addmem = false;



  }

  fn_Save(form: NgForm)
    {
      if (this.btnValue == 'MAP') {
        this.projectmodel.projectMembers

    } else {
        console.log('Hurraaaay!', this.selectedMemberList);
        for(let i=0; i< this.selectedMemberList.length ; i++){
          this.projectmodel.projectMembers.push(this.selectedMemberList[i])
        }

    }
 
      if(form.value.projectState == "started")
      {
        this.projectmodel.ismap = true;
        console.log(this.projectmodel)
      }
      else
      {
        this.projectmodel.ismap = false;
        console.log(this.projectmodel)
      }
  
  
      if (form.value._id == undefined || form.value._id == '' )
      {
        this.projectmodel = form.value;
  
        this.projectmodel.usrSelection = this.arr;

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

          this.projectService.putProject( this.projectmodel).subscribe((res) => {
            console.log(res);
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
this.fn_RefreshProjectList();

}
Fn_Member(event,opt)
{
  debugger;
console.log(opt.value+ ","+ opt.selected);
this.uId = opt.value;
this.isChecked=opt.selected;

let _model:any ={
  usrId: this.uId,
  isSelected: this.isChecked
};
// arr.push(_model);
 this.arr.push(_model);

 if (opt.value && opt.selected == true) {
  this.selectedMemberList.push(opt.value);
  console.log(this.selectedMemberList);

} else {
  this.selectedMemberList.forEach((element, index) => {
    this.selectedMemberList.splice(index,1)
    console.log('Spliced', this.selectedMemberList);
  });
  
}

 }

fn_Change(userId,userState)
{
  this.currentDate = new Date();

  debugger;
  console.log(userId,userState)
  if(userState=='started')
  {
    this.projectService.isMap(userId).subscribe();

  }
  else
  {
    this.projectService.isUnMap(userId).subscribe();

  }

}

fn_Map(project:Project)
{
  // console.log(  this.projectService.projects[0].projectLead)
  // console.log( project.projectLead)

  // this.projectService.projects =[]
  setTimeout(()=>{      window.scrollTo(0, 500);    },100);
 this.btnValue= $('.btn-warning').val();

  console.log("  this.btnValue",  this.btnValue)

  debugger;
  // this.usermodel.isExisitngMember = false;

  this.projectmodel = project;

  this.hide=true;
  this.show = true;
  this.view= false;

  $("#hide_content").show();

  this.userService.leadIsActive().subscribe((res:any)=>{

    this.teamleadList = [];
    
    for(let i=0;i<res.length;i++)
    {
      this.teamleadList.push(res[i]);
      console.log("this.teamleadList",this.teamleadList);
      this.projectmodel.projectLead = res[i];
      
    }
    console.log("project map",this.projectmodel)

  })
  
  this.userService.memberIsActive().subscribe((res:any)=>{

    this.teammemberList = [];
    
    for(let i=0;i<res.length;i++)
    {
      
      this.teammemberList.push(res[i]);
      console.log(this.teammemberList);
      this.projectmodel.projectMembers = this.teammemberList;
      
    }
    
  })

              //----- highlight selecte row-------//
              $('#tabledata tbody').on('click', 'tr', function() {
                $('#tabledata tbody > tr').removeClass('high-light');
                $(this).addClass('high-light');
              });
                 //----- highlight selecte row-------//

}

fn_Edit(project:Project)
{
  
  this.addmem= true
 // this.fn_Inactive();
  this.btnValue =''
   this.teamleadList=[];
 this.teammemberList=[];
 this.btnValue= $('.btn-primary').val();

 
  setTimeout(()=>{ window.scrollTo(0, 500);    },100)
  this.projectmodel = project;

  


   this.teamleadList  =    project.projectLead;
   this.projectmodel.projectLead =this.teamleadList[0].UserId

  this.teammemberList = project.projectMembers;
  console.log();
  this.projectmodel.projectMembers = [];
  for(let i=0;i< this.teammemberList.length;i++ )
  {
    this.projectmodel.projectMembers.push(this.teammemberList[i].UserId)

  }

  this.hide=true;
  this.show = true;
  this.view= false;

 

  $("#hide_content").show(); 

  this.AddMemberList = [];
  console.log("selected:",   this.projectmodel.projectMembers);
    this.userService.memberIsActive().subscribe((res : any) => {
 
        for (let i = 0; i < res.length; i++) {
 

           this.AddMemberList.push(res[i]);
            console.log("add:"+this.AddMemberList[i]._id+this.AddMemberList[i].name);
            
       
       
      

           
          } 

          this.AddMemberList = this.AddMemberList.filter((val)=>
          {
            return this.projectmodel.projectMembers.indexOf(val._id) == -1
          })
       
console.log(   this.AddMemberList);

        })

            //----- highlight selecte row-------//
    $('#tabledata tbody').on('click', 'tr', function() {
      $('#tabledata tbody > tr').removeClass('high-light');
      $(this).addClass('high-light');
    });
       //----- highlight selecte row-------//
}
fn_View(project : Project) {
  setTimeout(() => {
      window.scrollTo(0, 500);
  }, 100)

  this.projectmodel = project;

  this.hide = true;
  this.show = false;
  this.view = true;

  $("#hide_content").show();
  this.teammemberList = [];
  console.log(this.projectmodel.projectMembers);
  let members: any = this.projectmodel.projectMembers;
  for (let i = 0; i < members.length; i++) {
      this.teammemberList.push(members[i].name);
      console.log(this.teammemberList);

  }

      //----- highlight selecte row-------//
      $('#tabledata tbody').on('click', 'tr', function() {
        $('#tabledata tbody > tr').removeClass('high-light');
        $(this).addClass('high-light');
      });
         //----- highlight selecte row-------//
}

Fn_Expand(){
  
  $('#project-management').toggleClass('fullscreen'); 
 // this.Icon='fas fa-compress'
  if (this.Icon == 'fas fa-expand'){
    this.Icon='fas fa-compress';
} else {
  this.Icon='fas fa-expand';
}
 !this.sidebar;
}
fn_SelectRow(event: any, item: any) 
{
// $('  td').click(function(){ $(this).parent().find('td').addClass("high-light");  });
$('#tabledata tbody').on('click', 'tr', function() {
  $('#tabledata tbody > tr').removeClass('high-light');
  $(this).addClass('high-light');
});
}
}

