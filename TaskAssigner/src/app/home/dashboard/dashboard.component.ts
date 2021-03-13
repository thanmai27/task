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
  canvas:any; ctx:any;
  canvas2:any; ctx2:any; 
  canvas3:any; ctx3:any;
colorarray:any=[];
colors:any;
n:any;
rows:any;
labels:any = [];
baryaxis:any =[];
piedata:any =[];
project:Project[];
pielabels =["Queue", "Assign", "Started","ON hold","Cancelled","Completed"];

  constructor(
    private authservice:AuthService, 
    public userservice: UserManagementService, 
    public projectservice: ProjectmanagementService,
    public taskservice: TaskdemoService) { }

    
  
  ngOnInit() {

    $(document).attr("title", "TaskAssigner - Dashboard");

    for(let i=0;i<this.pielabels.length;i++)
    {
      
      this.taskservice.getTaskStatus(this.pielabels[i]).subscribe((res)=>
      {
        console.log(`${this.pielabels[i]}`,res);
        this.piedata.push(res)
      });
    }

      this.projectservice.totalCount().subscribe((result)=>
      {
        this.totalProjects=result;
        this.colorarray.length=0;
 
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
      this.ctx = this.canvas.getContext('2d');

      this.canvas2 = document.getElementById('myChart2');
      this.ctx2 = this.canvas2.getContext('2d');

      // this.canvas3 = document.getElementById('myChart3');
      //   this.ctx3 = this.canvas3.getContext('2d');
     
       
          this.colors=this.colorarray.toString();
          let myChart = new Chart(this.ctx, {
            type: 'bar',
            data: {
              
                labels: this.generateLabelsFromTableForBarChart(),
              
                datasets: [{
                    label: "No of Tasks",
                    data: this.baryaxis,
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
        
          
        let myChart2 = new Chart(this.ctx2, {
            type: 'doughnut',
            data: {
                labels: ["Queue", "Assign", "Started","ON hold","Cancelled","Completed"],
                datasets: [{
                    label: 'Active Angular Vesrions',
                    data: this.piedata,
                    backgroundColor: ["#7868e6","greenyellow", "#94ebcd","green","#f25287","yellow"],
                    borderWidth: 1
                }]
            },
            options: {
          legend: {
              display: true
          },
              responsive: true,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
            }
          });
        
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
  generateLabelsFromTableForBarChart()
  {        
   //getProjectList               
   
    this.projectservice.getProjectList ().subscribe((result:any)=>
    {
     this.labels.length=0;
     
      for(let i = 0;i<result.length;i++)
      {
        //console.log(result[i].projectName);
        this.labels.push(result[i].projectName);
       this.taskservice.getTotalTaskInProject(result[i].projectName).subscribe((res:any)=>
        {
          console.log("Individual task in project",res);
          this.baryaxis.push(res)
          
        })
        
        
      }
   
      this.rows = this.labels.toString();
    
    

      });



    return this.labels;
}

generateLabelsFromTableForPieChart()
{        
 
  for(let i=0;i<this.pielabels.length;i++)
  {
    this.taskservice.getTaskStatus(this.pielabels[i]).subscribe((res)=>console.log("pie res",res));
  }
 
}
}