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
  teamlead=[];
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
  
    fn_AssignExistienceProjectMember(type,Project){
      try{
        //setTimeout(()=>{
          this.userService.users.forEach(obj => {
            let value= this.projectService.projects.filter(ele=>((ele.projectLead||ele.projectMembers)==obj.name || ele.projectMembers.includes(obj.name)) && ele.projectState =="started")
  
          if(type && type==MAP ){
            if(value && value.length!=0){
              obj.isExisitngMember = true;
            }else{
              obj.isExisitngMember = false;
            }
            obj.enableOrDisable=false;
  
          }else{
            //if(value && value.length!=0 ){
              let value1= this.projectService.projects.filter(ele=>((ele.projectLead||ele.projectMembers)==obj.name || ele.projectMembers.includes(obj.name))&& ele.projectState =="started" &&ele.projectName==Project.projectName);
              if(value1.length==0){
                obj.enableOrDisable=true;
  
              }else{
                obj.enableOrDisable=false;
              }
            // }
            obj.isExisitngMember = false;
          }
  
  
  
          });
       // },1000)
      }catch(e){
        console.log(e)
      }
      // this.projectService.getProjectList().subscribe((res) => {
      //   this.projectService.projects = res as Project[];
  
      // });
      // this.userService.getUserList().subscribe((res) => {
      //   this.userService.users = res as User[];
      //   //console.log("User refresh",res)
  
      // });
  
  
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
  
  
      if (form.value._id == undefined || form.value._id == '' )
      {
        this.projectmodel = form.value;
  
  
        this.projectService.postProject( this.projectmodel).subscribe((data) => {
          this.fn_ResetForm();
          this.fn_RefreshProjectList();
          console.log("The data is", data);
          this.toastr.success("Project Added Successfully", "Your Request has sent !!!",
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
  
            this.toastr.success("Data Updated Successfully", "Your Request has sent !!!",
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
  
    debugger;
    // this.usermodel.isExisitngMember = true;
    this.isEditOrMap=true;
  
    this.fn_AssignExistienceProjectMember(EDIT,project);
  
    this.projectmodel = project;
  
    console.log("Edit",this.projectmodel)
  
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
  
  }
  

}
