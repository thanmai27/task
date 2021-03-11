import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserManagementService } from 'src/app/shared/user-management.service';
import { ProjectmanagementService } from 'src/app/shared/projectmanagement.service';
import { TaskdemoService } from 'src/app/shared/taskdemo.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalUsers:any;
  totalProjects:any;
  totalTasks:any;

  constructor(
    private authservice:AuthService, 
    public userservice: UserManagementService, 
    public projectservice: ProjectmanagementService,
    public taskservice: TaskdemoService,) { }


  ngOnInit() {
    this.userservice.totalCount().subscribe((result)=>this.totalUsers=result);
    this.projectservice.totalCount().subscribe((result)=>this.totalProjects=result);
    this.taskservice.totalCount().subscribe((result)=>this.totalTasks=result);


    
  }

  logout()
  {
    this.authservice.fn_LogOut();
  }
}
