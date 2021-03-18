import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { copyFileSync } from 'fs';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../model/project.model';
import { Taskdemo } from '../../model/taskdemo.model';
import { ProjectmanagementService } from '../../shared/projectmanagement.service';
import { TaskdemoService } from '../../shared/taskdemo.service';

import * as XLSX from 'xlsx';


import { Task } from 'src/app/model/task.model';
import { TaskmanagementService } from 'src/app/shared/taskmanagement.service'
import { TableComponent } from 'src/app/table/table.component';
import { TaskpopupComponent } from 'src/app/popup/taskpopup/taskpopup.component';

import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  project: Project[];
  taskmodel = new Taskdemo();
  pp = false;
  disableSelect = new FormControl(false);
  minDate:any;
  maxDate:any;
  pro_id: any;
  dtOptions: any = {};
  showModal: boolean;
  asdate: any;
  show = false;
  showdate = true;
  isReadOnly = false;
  hidedate = true;
  startReadOnly: any;
  cancellReadOnly: any;
  endReadOnly: any;
  msg;
  selected = 'Queue';
  optionDisabled: any;
  teamMember = [];
  projectList = [];
  createdmemeber: any;
  modifiedMember = [];
  sidebar= $('.main-sidebar ').show();
Icon='fas fa-expand'
  isAssign: any;
  isStart: any;
  isEnd: any;
  isCancel = false;

  statusControl = new FormControl('', Validators.required);
  projectControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  options = [];
  constructor(private projectService: ProjectmanagementService,
    public taskService: TaskdemoService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public datepipe: DatePipe) { }

  ngOnInit() {

    $(document).attr("title", "TaskAssigner - Task");

    setTimeout(function () {
      $('table').DataTable({
        responsive: true,

        "lengthMenu": [5, 10, 25, 50]
      });
    }, 100);

     this.minDate = new Date(); 
    //this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-ddTHH:mm:ss');    
    this.minDate= this.minDate.setMonth(  this.minDate.getMonth() - 1);
    this.minDate = this.datepipe.transform(this.minDate, 'yyyy-MM-ddTHH:mm:ss');    

    //this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-ddTHH:mm:ss');  
    this.maxDate = new Date(); 
  
    this.maxDate= this.maxDate.setMonth(  this.maxDate.getMonth() + 3);
    this.maxDate = this.datepipe.transform(this.maxDate, 'yyyy-MM-ddTHH:mm:ss'); 

   
    this.isAssign = false;
    this.isStart = false;
    this.isEnd = false;


    this.fn_ResetForm();
    this.fn_RefreshProjectList();
    this.fn_RefreshTaskList();

    var loggedUserdetails = JSON.parse(sessionStorage.getItem('loggedUserName'));
    // console.log(loggedUserdetails);
    this.createdmemeber = loggedUserdetails.userName;
    // console.log(this.createdmemeber);

  }


  Fn_AddTask() {
    this.teamMember = [];

    setTimeout(() => { window.scrollTo(0, 500); }, 100)
    this.fn_ResetForm();
    this.selected = "Queue";


    this.options = [this.selected];

    this.pp = false;

    this.isReadOnly = false;

    $("#show_content").click(function () {

      $("#hide_content,#table-content").show();

    })

    this.show = true;
    this.isAssign = false;
    this.isStart = false;
    this.isEnd = false;
    this.isCancel = false;
  }

  fn_ResetForm(form?: NgForm) {
    if (form)
      form.reset()
    this.taskmodel = {
      _id: "",
      projectName: "",
      teamMember: "",
      createdBy: "",
      modifiedBy: "",
      taskStatus: "",
      createdOn: null,
      assignOn: null,
      startOn: null,
      holdOn: null,
      endOn: null,
      cancelledOn: null,
      cancelReason:'',
      taskName: '',
      statusList: ''
    }

    this.fn_RefreshTaskList()
    $("#hide_content").hide();
  }

  Fn_Expand(){
  
    $('#task-management').toggleClass('fullscreen'); 
   // this.Icon='fas fa-compress'
    if (this.Icon == 'fas fa-expand'){
      this.Icon='fas fa-compress';
  } else {
    this.Icon='fas fa-expand';
  }
   !this.sidebar;
  }
  fn_RefreshTaskList() {
    this.taskService.getTaskList().subscribe((res) => {
      this.taskService.tasks = res as Taskdemo[];

    });
  }
  fn_RefreshProjectList() {

          // this.projectService.getStartedProjects().subscribe((res: any) => {

   this.projectService.getProjectList().subscribe((res: any) => {

      this.projectService.projects = res as Project[];

      for (let i = 0; i < res.length; i++) {
 
          this.projectList.push(res[i].projectName);
           

      }
    });
  }
  fn_Edit(task: Taskdemo) {
    $("#hide_content").show();
    this.fn_Change2(task.taskStatus)
    this.options = [];

    this.selected=task.taskStatus
    this.options.push(this.selected)
    console.log(task)
    this.pp = true;
    this.taskmodel = task;
    this.isAssign = true;

    this.isReadOnly = true;
    this.show = true;

    this.selected = task.taskStatus;
    this.asdate = task.assignOn;
    setTimeout(() => { window.scrollTo(0, 500); }, 100)

    this.teamMember = [];
    this.modifiedMember = []
    this.teamMember.push(task.teamMember)



    console.log(this.taskmodel.statusList.length)

    for (let i = 0; i < this.taskmodel.statusList.length; i++) {
     // this.options.push(task.taskStatus)

      this.options.push(this.taskmodel.statusList[i])
    }
    if (task.taskStatus == 'Started' && task.startOn != null) {
      this.startReadOnly = true;
      this.isStart = true;
    }

    //----- highlight selecte row-------//
    $('#tabledata tbody').on('click', 'tr', function() {
      $('#tabledata tbody > tr').removeClass('high-light');
      $(this).addClass('high-light');
    });
       //----- highlight selecte row-------//
  }

  fn_Select(projectId) {
    this.teamMember = [];
    this.pro_id = projectId;
    this.projectService.getOneProjectList(projectId).subscribe((res: any) => {
      while (this.teamMember.length) {
        this.teamMember.pop();
      }
      let task = res.projectMembers

      for (let i = 0; i < task.length; i++) {
        this.teamMember.push(task[i].name);
      }
      this.teamMember.push(res.projectLead[0].name);



    })
  }

  fn_View(task: Task) {


    let dialogRef = this.dialog.open(TaskpopupComponent, { data: { tasks: task } })

  }
  fn_Cancel() {
    this.show = false;
    this.fn_ResetForm();
  }

  fn_Change2(s: any) {

    console.log(s);
    console.log(this.taskmodel._id)

    if (s == "Assign") {
      this.isAssign = true;
      this.isReadOnly = false;
      this.isCancel = false;

    }
    if (s == "Started") {
      this.isStart = true;
      this.startReadOnly = false;
      this.isCancel = false;
      this.taskmodel.holdOn = null;
      this.isEnd = false;
      this.taskmodel.endOn = null;

    }
    if (s == "ON hold") {
      this.isStart = true;
      this.startReadOnly = true;
      this.isCancel = false;
      this.isEnd = true;
    }

    if (s == "Cancelled") {
      this.isCancel = true;
      this.isEnd = false;

    }
    if (s == "Completed") {
      this.isEnd = true;
      this.isStart = true;
      this.startReadOnly = true;
      this.isCancel = false;

    }
  }

  fn_Save(form: NgForm) {
    debugger;

    console.log(form.value)
    this.taskmodel.taskStatus = this.selected;
    if (form.value._id == undefined || form.value._id == '') {

      this.taskmodel = form.value;
      this.taskmodel.taskStatus = this.selected
      this.taskmodel.createdBy = this.createdmemeber
      this.taskmodel.createdOn = new Date()
      // this.taskmodel.creadtedBy = this.defaultName;
      this.taskService.postTask(this.taskmodel).subscribe((data) => {

        this.fn_RefreshTaskList();
        // setTimeout(()=>{     
        //    window.location.reload() ; 
        // },500)

        console.log("The data is", data);
        this.toastr.success(" OK", "Task Added Successfully",
          {
            timeOut: 2000,
            progressAnimation: 'increasing',

          })


        $("#hide_content").hide();




      }, (error) => {
        this.msg = JSON.stringify(error.error);
        this.toastr.error("Error", this.msg,
          {
            timeOut: 2000
          })
      });
    }
    else {
      if (this.taskmodel.taskStatus == "ON hold") {
        this.taskmodel.holdOn = this.taskmodel.endOn;
      }
      else if (this.taskmodel.taskStatus == "Started") {
        this.taskmodel.holdOn = null;
        this.taskmodel.endOn = null
      }
      else {
        this.taskmodel.holdOn = null;
      }
      this.taskService.putTask(this.taskmodel).subscribe((res) => {

        console.log(res);
        this.fn_RefreshTaskList();
        $("#hide_content").hide();

        this.toastr.success("OK", "Task Updated Successfully",
          {
            timeOut: 2000,
            progressAnimation: 'increasing',


          })
        // setTimeout(()=>{ window.location.reload();},100)

      },
        (error) => {
          this.msg = JSON.stringify(error.error);
          this.toastr.warning(this.msg, "warning",
            {
              timeOut: 4000,

            })
        });

    }

  }
  fn_Download() {

    // this.taskService.downloadFile(    this.taskService.tasks, 'taskdetails');
    let element = document.getElementById('tabledata');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    ws['!cols'] = [];
    ws['!cols'][8] = { hidden: true };


    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "task.xlsx");

  }


}
