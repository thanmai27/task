import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ToastrService } from 'ngx-toastr';
import { on } from 'process';
import {AuthService} from '../auth.service'
import { ProjectmanagementService } from '../shared/projectmanagement.service';
import { TaskdemoService } from '../shared/taskdemo.service';
import { TasksComponent } from './tasks/tasks.component';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  profile;
clientname:any;

  constructor( 
    private router:Router,
    private msal:MsalService,
    private http:HttpClient,
    private authservice:AuthService,
    public taskService: TaskdemoService,
    private projectService: ProjectmanagementService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public datepipe: DatePipe) { }

  ngOnInit() {
    var loggedUserdetails=JSON.parse(sessionStorage.getItem('loggedUserName'));
    // console.log(loggedUserdetails);
    this.clientname=loggedUserdetails.userName;
  }


Logout()
{

  this.authservice.fn_LogOut();
  


}

fn_Click()
{
  this.taskService.getTaskList().subscribe((res)=>console.log("OK"));

  let ob = new TasksComponent(this.projectService,this.taskService,this.toastr,this.dialog,this.datepipe);
  ob.fn_RefreshTaskList();
  ob.Fn_AddTask();
  ob.fn_Cancel();

}

}
