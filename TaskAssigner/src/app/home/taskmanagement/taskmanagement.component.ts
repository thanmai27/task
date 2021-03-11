import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common'
import * as XLSX from 'xlsx';


import { Project } from 'src/app/model/project.model';
import { Task } from 'src/app/model/task.model';
import { ProjectmanagementService } from 'src/app/shared/projectmanagement.service';
import { TaskmanagementService } from 'src/app/shared/taskmanagement.service'
import { TableComponent } from 'src/app/table/table.component';
import { TaskpopupComponent } from 'src/app/popup/taskpopup/taskpopup.component';

import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-taskmanagement',
  templateUrl: './taskmanagement.component.html',
  styleUrls: ['./taskmanagement.component.css']
})
export class TaskmanagementComponent implements OnInit {

  project: Project[];
  taskmodel = new Task();
  pp = false;
  disableSelect = new FormControl(false);

  pro_id: any;
  dtOptions: any = {};
  showModal: boolean;
  defaultName = "Nithin Kumar"
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
  createdMember = [];
  modifiedMember = [];

  isAssign: any;
  isStart: any;
  isEnd: any;
  isCancel = false;

  statusControl = new FormControl('', Validators.required);
  projectControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  options = ['Queue', 'Assign', 'Started', 'Completed', 'ON hold', 'Cancelled'];

  test = [];
  counter = 0;

  myDate:any ;

  constructor(
    public projectService: ProjectmanagementService,
    public taskService: TaskmanagementService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) {

  }


  ngOnInit() {
   this.myDate = new Date();

    this.myDate = this.datepipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss.SSS');    
    console.log(" this.today", this.myDate)

    setTimeout(function () {
      $('table').DataTable({
        responsive: true,

        "lengthMenu": [5, 10, 25, 50]
      });
    }, 100);

    // //assign date

    this.isAssign = false;
    this.isStart = false;
    this.isEnd = false;


    this.fn_ResetForm();
    this.fn_RefreshProjectList();
    this.fn_RefreshTaskList();

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
      taskName: ''
    }

    this.fn_RefreshTaskList()
    $("#hide_content").hide();
  }
  fn_RefreshTaskList() {
    this.taskService.getTaskList().subscribe((res) => {
      this.taskService.tasks = res as Task[];

    });
  }
  fn_RefreshProjectList() {
    this.projectService.getProjectList().subscribe((res: any) => {
      this.projectService.projects = res as Project[];

      for (let i = 0; i < res.length; i++) {
        this.projectList.push(res[i].projectName);

      }
    });
  }
  Fn_AddTask() {

    this.teamMember = [];
    this.createdMember = [];

    setTimeout(() => { window.scrollTo(0, 500); }, 100)
    //  this.fn_ResetForm();
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
      taskName: ''
    }

    this.options = ['Queue'];

    this.selected = "Queue";
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
  fn_Save(form: NgForm) {
    debugger;



    setTimeout(() => { this.fn_Change2(this.selected); }, 500)

    console.log(form.value)
    this.taskmodel.taskStatus = this.selected;
    if (form.value._id == undefined || form.value._id == '') {

      this.taskmodel = form.value;
      this.taskmodel.taskStatus = this.selected
      this.taskmodel.createdOn = new Date()
      // this.taskmodel.creadtedBy = this.defaultName;
      this.taskService.postTask(this.taskmodel).subscribe((data) => {
        console.log(data);

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

  fn_Select(projectId) {
    this.teamMember = [];
    this.createdMember = []
    this.pro_id = projectId;
    this.projectService.getOneProjectList(projectId).subscribe((res: any) => {
      while (this.teamMember.length || this.createdMember.length) {
        this.teamMember.pop();
        this.createdMember.pop();
      }
      let task = res.projectMembers

      for (let i = 0; i < task.length; i++) {
        this.teamMember.push(task[i]);
        this.createdMember.push(task[i]);
      }
      this.teamMember.push(res.projectLead);
      this.createdMember.push(res.projectLead)


    })
  }

  fn_Cancel() {
    this.show = false;
    this.fn_ResetForm();

  }

  fn_Edit(task: Task) {
    this.pp = true;
    this.selected = task.taskStatus;
    this.asdate = task.assignOn;
    console.log(task)
    setTimeout(() => { window.scrollTo(0, 500); }, 100)

    this.teamMember = [];
    this.createdMember = [];
    this.modifiedMember = []
    console.log(this.projectList);
    this.teamMember.push(task.teamMember)
    this.createdMember.push(task.createdBy);

    //  this.projectService.selectProject(task.projectName).subscribe((res:any)=>
    //  {
    //    console.log(res[0].projectMembers)

    //   while(this.modifiedMember.length){
    //     this.modifiedMember.pop();
    //   }
    //   let task =  res[0].projectMembers

    //   for(let i=0;i<task.length;i++)
    //   {
    //     this.modifiedMember.push(task[i]);
    //   }
    //   this.modifiedMember.push(res[0].projectLead);
    //  })
    this.fn_Change2(task.taskStatus);
    this.selected = task.taskStatus;

    this.taskmodel = task;
    this.isAssign = true;

    this.isReadOnly = true;
    this.show = true;

    if (this.selected == "Started" && task.startOn != null) {
      this.startReadOnly = true;

    }
    if (this.selected == "ON hold") {
      this.startReadOnly = true;
      // this.cancellReadOnly=true;
      this.endReadOnly = true

    }
    if (this.taskmodel.holdOn != null) {
      this.options = ['Started', 'ON hold', 'Cancelled'];

    }
    $("#hide_content").show();
    window.scrollTo(0, 500);
  }


  fn_Change2(s: any) {

    console.log(s);




    if (s == 'Queue') {
      this.isAssign = true;
      this.isStart = false;
      this.isEnd = false;
      this.isCancel = false;


      this.isReadOnly = true;

      this.options = ['Queue', 'Assign',];



    }
    else if (s == "Assign") {
      this.options = ['Assign', 'Started'];

      this.taskmodel.startOn = null;//uncomment in on-hold checking
      this.taskmodel.endOn = null;
      this.taskmodel.cancelledOn = null;


      if (this.taskmodel.assignOn == null) {
        this.isAssign = true;
        this.isReadOnly = false;
        this.isStart = false;
        this.isEnd = false;
        this.isCancel = false;

      }
      else {
        this.isAssign = true;
        this.isReadOnly = true;
        this.isStart = false;
        this.isEnd = false;
        this.isCancel = false;

      }


    }

    else if (s == 'Started') {
      // this.selected ="Started"
      console.log(this.taskmodel.holdOn)

      if (this.asdate == null) {
        this.options = ['Assign', 'Started', 'ON hold', 'Cancelled', 'Completed'];
        this.taskmodel.startOn = null;


      }
      else {
        this.options = ['Started', 'ON hold', 'Cancelled', 'Completed'];

      }



      this.isStart = true;
      this.startReadOnly = false;

      this.isAssign = true;

      this.isReadOnly = true;
      // this.startReadOnly=false;
      this.isEnd = false;
      this.isCancel = false;
      this.taskmodel.cancelledOn = null;

      if (this.taskmodel.startOn == null) {
        this.startReadOnly = false;

      }
      else if (this.taskmodel.startOn != null && this.taskmodel.taskStatus == "Started") {
        this.startReadOnly = true;
        this.isReadOnly = false;


      }
      else {
        this.startReadOnly = true;


      }


      if (this.taskmodel.assignOn == null && this.taskmodel.taskStatus == "Started" && this.taskmodel.startOn != null) {
        this.isAssign = true;
        this.isReadOnly = false;

      }
      if (this.taskmodel.assignOn != null && this.taskmodel.taskStatus == "Started" && this.taskmodel.startOn != null) {
        this.startReadOnly = false;
        this.isStart = true;
        this.isReadOnly = true;



      }
      if (this.taskmodel.startOn != null) {
        this.startReadOnly = true;
        this.isStart = true;


      }
      if (this.taskmodel.holdOn != null && this.taskmodel.startOn != null) {
        this.startReadOnly = false;
        this.isStart = true;


      }

    }
    else if (s == 'ON hold') {
      debugger;
      this.taskmodel.cancelledOn = null;

      this.isEnd = true;
      this.isStart = true;
      this.isCancel = false;

      if (this.asdate == null) {
        this.options = ['Assign', 'Started', 'Completed', 'ON hold', 'Cancelled'];

      }

      else {
        this.options = ['Started', 'Completed', 'ON hold', 'Cancelled'];

      }

      if (this.taskmodel.startOn == null) {
        this.startReadOnly = false;
      }
      if (this.taskmodel.startOn != null) {
        this.startReadOnly = true;
      }
      if (this.taskmodel.startOn != null && this.taskmodel.endOn == null) {
        this.endReadOnly = false;
      }
      if (this.taskmodel.endOn != null) {
        this.endReadOnly = true;
      }

      if (this.taskmodel.assignOn == null && this.taskmodel.startOn == null) {
        this.endReadOnly = false;
      }

      if (this.taskmodel.assignOn != null && this.taskmodel.startOn == null) {
        this.endReadOnly = false;
      }

      if (this.taskmodel.assignOn != null && this.taskmodel.startOn == null) {
        this.endReadOnly = false;
      }

      if (this.taskmodel.assignOn != null && this.taskmodel.startOn != null && this.taskmodel.holdOn != null) {
        if (new Date(this.taskmodel.startOn) < new Date(this.taskmodel.endOn)) {
          this.endReadOnly = true;
          this.startReadOnly = true;
        }
        else {
          this.endReadOnly = false;
          this.startReadOnly = true;
        }

      }

      else {
        this.taskmodel.endOn = null;
        this.taskmodel.startOn = this.taskmodel.startOn;
        if (this.taskmodel.startOn == null) {
          this.startReadOnly = false;

        }
        else {
          this.startReadOnly = true;

        }
        this.endReadOnly = false

      }


    }
    else if (s == 'Completed') {
      this.taskmodel.endOn = null;
      if (this.asdate == null) {
        this.options = ['Assign', 'Started', 'Completed', 'ON hold', 'Cancelled'];

      }
      else {
        this.options = ['Started', 'Completed', 'ON hold', 'Cancelled'];

      }

      this.isEnd = true;
      this.isCancel = false;

      this.startReadOnly = true;
      if (this.taskmodel.startOn == null) {
        this.startReadOnly = false;

      }
      if (this.taskmodel.startOn != null) {
        this.endReadOnly = false;

      }

    }
    else if (s == 'Cancelled') {
      this.taskmodel.cancelledOn = null;
      //  this.taskmodel.startOn=null;
      if (this.asdate != null) {
        this.options = ['Started', 'Completed', 'ON hold', 'Cancelled'];

      }
      else if (this.taskmodel.startOn != null) {
        this.options = ['Completed', 'ON hold', 'Cancelled'];

      }

      else {
        this.options = ['Assign', 'Started', 'Completed', 'ON hold', 'Cancelled'];

      }

      this.isCancel = true;
      this.startReadOnly = true;
      this.isEnd = false;
      this.isStart = false;
      if (this.taskmodel.holdOn != null && this.taskmodel.assignOn != null && this.taskmodel.endOn != null) {
        this.taskmodel.endOn = this.taskmodel.endOn
      }
      else { this.taskmodel.endOn = null }


    }


  }


  fn_View(task: Task) {
    // this.taskmodel = task;
    // this.selected =  task.taskStatus;
    // this.teamMember = [];
    // this.teamMember.push(task.teamMember);

    let dialogRef = this.dialog.open(TaskpopupComponent, { data: { tasks: task } })

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
