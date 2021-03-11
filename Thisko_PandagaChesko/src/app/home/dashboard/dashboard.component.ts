import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserManagementService } from 'src/app/shared/user-management.service';
import { ProjectmanagementService } from 'src/app/shared/projectmanagement.service';
import { TaskdemoService } from 'src/app/shared/taskdemo.service';
import * as Chart from 'chart.js'
import { Project } from 'src/app/model/project.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  totalUsers:any;
  totalProjects:any;
  totalTasks:any;
  canvas:any; ctx:any; canvas2:any; ctx2:any; canvas3:any; ctx3:any;
colorarray:any=[];
colors:any;
n:any;
rows:any;
labels:any = [];
project:Project[];
  constructor(
    private authservice:AuthService, 
    public userservice: UserManagementService, 
    public projectservice: ProjectmanagementService,
    public taskservice: TaskdemoService) { }

    
  
  ngOnInit() {

      this.projectservice.totalCount().subscribe((result)=>
      {
        this.totalProjects=result;
        this.colorarray.length=0;
        // console.log(this.totalProjects);

        // var dynamicColors = function() {
        //   var r = Math.floor(Math.random() * 255);
        //   var g = Math.floor(Math.random() * 255);
        //   var b = Math.floor(Math.random() * 255);
        //   return "rgb(" + r + "," + g + "," + b + ")";
        //   };
        for(var i=0;i<this.totalProjects;i++)
        {
            var randomColor =  "#"+((1<<24)*Math.random()|0).toString(16); 
            this.colorarray.push(randomColor);
            console.log(this.colorarray);
          
           // this.colors=this.colorarray.toString();
            //this.colors = "'" + this.colorarray.join("','") + "'";
          
      }
      
      
      });
      this.userservice.totalCount().subscribe((result)=>this.totalUsers=result);
    
      this.taskservice.totalCount().subscribe((result)=>this.totalTasks=result);
      this.canvas = document.getElementById('myChart');
      // this.canvas2 = document.getElementById('myChart2');
      // this.canvas3 = document.getElementById('myChart3');
      this.ctx = this.canvas.getContext('2d');
      // this.ctx2 = this.canvas2.getContext('2d');
      //   this.ctx3 = this.canvas3.getContext('2d');
     
       
          this.colors=this.colorarray.toString();
          let myChart = new Chart(this.ctx, {
            type: 'bar',
            data: {
              
                labels: this.generateLabelsFromTable(),
              
                datasets: [{
                    label: "All Project",
                    data: [5, 10, 6,6],
                    backgroundColor:this.colorarray,
                    borderWidth: 0,
                    barThickness: 50,
                }]
            },
            options: {
            legend: {
              display: true
            },
            responsive: true,
      
            scales: {
              xAxes: [{
                  stacked: true
              }],
              yAxes: [{
                  stacked: true
              }]
          }
            }
          });
        
        // let myChart2 = new Chart(this.ctx2, {
        //     type: 'pie',
        //     data: {
        //         labels: ["Angular 11", "Angular 10", "Angular 9"],
        //         datasets: [{
        //             label: 'Active Angular Vesrions',
        //             data: [85, 100, 60],
        //             backgroundColor: ["red","blue", "orange"],
        //             borderWidth: 1
        //         }]
        //     },
        //     options: {
        //   legend: {
        //       display: true
        //   },
        //       responsive: true,
        //   scales: {
        //       yAxes: [{
        //           ticks: {
        //               beginAtZero: true
        //           }
        //       }]
        //   }
        //     }
        //   });
        
        // let myChart3 = new Chart(this.ctx3, {
        //     type: 'line',
        //     data: {
        //         labels: ["Angular 11", "Angular 10", "Angular 9"],
        //         datasets: [{
        //             label: 'Active Angular Vesrions',
        //             data: [85, 100, 60],
        //             backgroundColor: ["red","blue", "orange"],
        //             borderWidth: 1
        //         }]
        //     },
        //     options: {
        //   legend: {
        //       display: true
        //   },
        //       responsive: true,
             
        //   scales: {
        //       yAxes: [{
        //           ticks: {
        //               beginAtZero: true
        //           }
        //       }]
        //   }
        //     }
        //   });
      // let chart = new CanvasJS.Chart("chartContainer", {
      //   animationEnabled: true,
      //   exportEnabled: true,
      //   title: {
      //     text: "Basic Column Chart in Angular"
      //   },
      //   data: [{
      //     type: "column",
      //     dataPoints: [
      //       { y: 71, label: "Apple" },
      //       { y: 55, label: "Mango" },
      //       { y: 50, label: "Orange" },
      //       { y: 65, label: "Banana" },
      //       { y: 95, label: "Pineapple" },
      //       { y: 68, label: "Pears" },
      //       { y: 28, label: "Grapes" },
      //       { y: 34, label: "Lychee" },
      //       { y: 14, label: "Jackfruit" }
      //     ]
      //   }]
      // });
        
      // chart.render();
     
    
        }

  logout()
  {
    this.authservice.fn_LogOut();
  }
  generateLabelsFromTable()
  {        
   //getProjectList               
   
    this.projectservice.getProjectList ().subscribe((result:any)=>
    {
     this.labels.length=0;
     
      for(let i = 0;i<result.length;i++)
      {
        //console.log(result[i].projectName);
        this.labels.push(result[i].projectName)
        
        
      }
   
      this.rows = this.labels.toString();
    
    
    //  this.labels.project=result as Project[];
    //   console.log("labels:"+this.labels.project)
    //   alert(this.labels.project.projectName);
      });

// this.userService.users.forEach(obj => {
//   let value= this.projectService.projects.filter(ele=>((ele.projectLead||ele.projectMembers)==obj.name || ele.projectMembers.includes(obj.name)) && ele.projectState =="started")

  //  this.labels.project.foreach(function(index){
  //       if (index != 0)  // we dont need first row of table
  //      {
  //            var cols = this.labels.project.projectName[index];  
  //          console.log("cols:"+cols);
                
  //          this.colorarray.push(cols);                           
  //       }
  //   });
  // this.labels.project.forEach(element => {let pn=this.labels.project.filter(this.labels.projectName);
  // this.colorarray.push(pn);});

    return this.labels;
}
}