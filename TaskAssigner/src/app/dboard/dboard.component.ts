import { Component, OnInit } from '@angular/core';
import { ProjectmanagementService } from '../shared/projectmanagement.service';
import { TaskdemoService } from '../shared/taskdemo.service';
import { UserManagementService } from '../shared/user-management.service';
import * as Chart from 'chart.js'


@Component({
  selector: 'app-dboard',
  templateUrl: './dboard.component.html',
  styleUrls: ['./dboard.component.css']
})
export class DboardComponent implements OnInit {

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
  barxlabels:any = [];
  baryaxis:any =[];
  piedata:any =[];
  pielabels =["Queue", "Assign", "Started","ON hold","Cancelled","Completed"];
  projectName;any

  myChart;myChart2;myChart3;
taskData = [];
statusData= [];
barchartdata:any;
piechartdata:any;

  constructor(
    public userservice: UserManagementService, 
    public projectservice: ProjectmanagementService,
    public taskservice: TaskdemoService) { }
  ngOnInit()
  {

    
    this.projectservice.totalCount().subscribe((result)=>
    {
      this.totalProjects=result;
      this.colorarray.length=0;
      for(var i=0;i<this.totalProjects;i++)
      {
          var randomColor =  "#"+((1<<24)*Math.random()|0).toString(16); 
          this.colorarray.push(randomColor);
 
        
      }
    
    
    });
    this.userservice.totalCount().subscribe((result)=>this.totalUsers=result);
  
    this.taskservice.totalCount().subscribe((result)=>this.totalTasks=result);

    this.fn_BarChart();
    this.fn_PieChart()
  }

  fn_BarChart()
  {
    
    this.baryaxis =[];
    this.barxlabels =[];

    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');

    this.projectservice.getProjectList ().subscribe((result:any)=>
    {
      debugger;
     
      for(let i=0;i<result.length;i++)
      {
        this.barxlabels.push(result[i].projectName); 
      }

       for(let j=0;j<this.barxlabels.length;j++)
       {
          this.taskservice.getTotalTaskInProject(this.barxlabels[j]).subscribe((res:any)=>
         {
           this.baryaxis.push(res)
           
         })
       } 

    });

    console.log("BarChart X lables :",this.barxlabels);
    console.log("BarChart y lables :",this.baryaxis);
    
    this.colors=this.colorarray.toString();
    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: 
      {
              labels:  this.barxlabels,
              datasets: [{
              label: "No of Tasks",
              data: this.baryaxis,
              backgroundColor:this.colorarray,
              borderWidth: 0,
              barThickness: 50,
          }]
      },
      options:
      {
        responsive: true,
        scales: 
        {
          xAxes: [{stacked: true}],
          yAxes: [{stacked: true}]
        }
      }

    });

  }

  onBarChartClick(e: any): void {

    this.barchartdata=true;
    this.piechartdata=false;
    let Arr =[];
    let leb =[];
    let test =[];
    this.pielabels =[];
    this.piedata =[];
  
  
  
    setTimeout(()=>{      window.scrollTo(0, 500);    },100)
  
  
    var activePoints =this.myChart.getElementsAtEvent(e);
        if (activePoints[0]) {
          var chartData = activePoints[0]['_chart'].config.data;
          var idx = activePoints[0]['_index'];
  
          var label = chartData.labels[idx];
          var value = chartData.datasets[0].data[idx];
          this.projectName =label;
  
          this.taskData =[];
          this.taskservice.getDetailsOfTaskInProject(label).subscribe((result:any)=>
          {
            for(let i=0;i<result.length;i++)
            {
              this.taskData.push(result[i]);
              test.push( this.taskData[i].taskStatus)
             test = [...new Set(  test)];
  
  
            }
         console.log(  "  test",test);
         
  
            for(let j=0;j<test.length;j++)
            {
               this.taskservice.checkStatus(label,test[j]).subscribe((res:any)=>
               {
                console.log(`checkstatus${this.taskData[j].taskStatus}`,res);
       
                Arr.push(res)
                leb.push(this.taskData[j].taskStatus);
                leb = [...new Set(leb)];
                
  
                console.log("Arr",Arr);
                this.myChart2.destroy();
          this.myChart2= new Chart(this.ctx2, {
            type: 'doughnut',
            data: {
                labels: leb,
                datasets: [{
                    data:  Arr,
                    backgroundColor: ["#7868e6","greenyellow", "#94ebcd","green","#f25287","yellow"],
                    borderWidth: 1
                }]
            },
            options: {
          legend: {
              display: true
          },
              responsive: true,
          scales: 
          {
              yAxes: [{
                  ticks:
                  {
                    beginAtZero: true
                  }
              }]
          }
            }
          });
  
  
  
                
               }
              );
            }
  
  
  
          })
  
  
  }
  
  
  }

  fn_PieChart()
  {
    this.canvas2 = document.getElementById('myChart2');
    this.ctx2 = this.canvas2.getContext('2d');

    for(let i=0;i<this.pielabels.length;i++)
    {
      
      this.taskservice.getTaskStatus(this.pielabels[i]).subscribe((res)=>
      {
        //console.log(`${this.pielabels[i]}`,res);
        this.piedata.push(res)
      });
    }

    this.myChart2 = new Chart(this.ctx2, {
      type: 'doughnut',
      data: {
          labels: this.pielabels,
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
    scales: 
    {
        yAxes: [{
            ticks:
            {
              beginAtZero: true
            }
        }]
    }
      }
    });

  }
}
