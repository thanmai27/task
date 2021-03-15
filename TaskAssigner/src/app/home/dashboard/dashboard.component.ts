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

  myChart;myChart2;
taskData = [];
statusData= [];
barchartdata:any;
piechartdata:any;
  constructor(
    private authservice:AuthService, 
    public userservice: UserManagementService, 
    public projectservice: ProjectmanagementService,
    public taskservice: TaskdemoService) { }

    
  
  ngOnInit() {

    $(document).attr("title", "TaskAssigner - Dashboard");


    this.barchartdata=false;
    this.piechartdata=false;

    
    for(let i=0;i<this.pielabels.length;i++)
    {
      
      this.taskservice.getTaskStatus(this.pielabels[i]).subscribe((res)=>
      {
        //console.log(`${this.pielabels[i]}`,res);
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
           // console.log(this.colorarray);
          
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
          this.myChart = new Chart(this.ctx, {
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
            //   onClick: function(e) {
            //     var element = this.getElementAtEvent(e);
            //     if (element.length) {
            //        console.log(element[0]);
                   
            //        this.taskservice.getDetailsOfTaskInProject("Green Matters").subscribe((result)=>alert(result))

            //     }
            //  },
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
        
          
        //   this.canvas.onclick = function(evt) {
        //     debugger;
        //     var activePoints = myChart.getElementsAtEvent(evt);
        //     if (activePoints[0]) {
        //       var chartData = activePoints[0]['_chart'].config.data;
        //       var idx = activePoints[0]['_index'];
      
        //       var label = chartData.labels[idx];
        //       var value = chartData.datasets[0].data[idx];
      
        //       alert(label);
          
           
        //  function fn_getprojecttask(projectName)
        //   {

        //     alert("function is called" +projectName);
        //   this.taskservice.getDetailsOfTaskInProject(projectName).subscribe((result)=>alert(result))

        //   }

        //   fn_getprojecttask(label)

                
        //        }
        //   };
          


        this.myChart2 = new Chart(this.ctx2, {
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

      
  

        }

  // logout()
  // {
  //   this.authservice.fn_LogOut();
  // }
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
          //console.log("Individual task in project",res);
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



onBarChartClick(e: any): void {

  this.barchartdata=true;
  this.piechartdata=false;

  setTimeout(()=>{      window.scrollTo(0, 500);    },100)


  var activePoints =this.myChart.getElementsAtEvent(e);
      if (activePoints[0]) {
        var chartData = activePoints[0]['_chart'].config.data;
        var idx = activePoints[0]['_index'];

        var label = chartData.labels[idx];
        var value = chartData.datasets[0].data[idx];

        this.taskData =[];

        this.taskservice.getDetailsOfTaskInProject(label).subscribe((result:any)=>
        {
          debugger;
          for(let i=0;i<result.length;i++)
          {
            this.taskData.push(result[i]);

          }
          console.log(this.taskData);


        })


}
}

onPieChartClick(e: any): void {

  this.barchartdata=false;
  this.piechartdata=true;
  setTimeout(()=>{      window.scrollTo(0, 500);    },100)


  var activePoints =this.myChart2.getElementsAtEvent(e);
      if (activePoints[0]) {
        var chartData = activePoints[0]['_chart'].config.data;
        var idx = activePoints[0]['_index'];

        var label = chartData.labels[idx];
        var value = chartData.datasets[0].data[idx];

        this.statusData =[];

        this.taskservice.getDetailsOfTaskStatus(label).subscribe((result:any)=>
        {
          debugger;
          for(let i=0;i<result.length;i++)
          {
            this.statusData.push(result[i]);

          }
          console.log(this.statusData);


        })


}
}




}