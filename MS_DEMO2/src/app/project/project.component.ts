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
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {


  msg;
  show=false;
  hide=false;
  view=false;
  currentDate:Date;
  users:User[];
  project:Project[];
  teamleadList:any=[];
  teammemberList:any=[];
  member;
  dtOptions: DataTables.Settings = {};
  
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
        projectMembers:'',
        ismap:null,
        usrSelection:[]
        // usrId:'',
        // isSelected:false,
  
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
    fn_Save(form: NgForm)
    {
 
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
  
  
        this.projectService.postProject( this.projectmodel).subscribe((data) => {
          this.fn_ResetForm();
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


  fn_Change(userId,userState)
  {
    
  
  }
  
  fn_Map(project:Project)
  {
    setTimeout(()=>{      window.scrollTo(0, 500);    },100);

    debugger;
    // this.usermodel.isExisitngMember = false;
    this.isEditOrMap=false;
  
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
        console.log(this.teamleadList);
        this.projectmodel.projectMembers =    this.teamleadList
        
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

  
  }
  
  fn_Edit(project:Project)
  {
   console.log(project);
   this.teamleadList=[];
   this.teammemberList=[];
   
    setTimeout(()=>{ window.scrollTo(0, 500);    },100)
    this.projectmodel = project;
    

    for(let i =0;i<project.projectLead.length;i++)
    {
      this.teamleadList.push(project.projectLead[i]);
      this.projectmodel.projectLead = this.teamleadList;
    }
    for(let i =0;i<project.projectMembers.length;i++)
    {
      this.teammemberList.push(project.projectMembers[i]);
      console.log(  "  this.teammemberList",this.teammemberList);
      
      this.projectmodel.projectMembers = this.teammemberList;

    }
    
    
  
    this.hide=true;
    this.show = true;
    this.view= false;
  
    $("#hide_content").show(); 
  }

  fn_View(project:Project)
  {
    
  
  }
  
  Fn_Member(event,opt)
{
console.log(opt.id + "," +opt.selected);

 }

}
