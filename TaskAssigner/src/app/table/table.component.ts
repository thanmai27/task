import { Component, OnInit,AfterViewInit ,ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Project } from '../model/project.model';
import { ProjectmanagementService } from '../shared/projectmanagement.service';
import { TaskmanagementService } from '../shared/taskmanagement.service';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  project:Project[];
  disableSelect = new FormControl(false);
  selected = 'Queue';

changes = [];
  options = ['Queue','Assign','Started','Completed','ON hold','Cancelled'];


  displayedColumns: string[] = ['projectName', 'projectState', 'projectLead', 'createdOn','actions'];
  dataSource: MatTableDataSource<Project>;

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  constructor(public projectService:ProjectmanagementService, public taskService:TaskmanagementService ) {


  }

  ngOnInit() {

    setTimeout(function(){
      $('table').DataTable( {
      responsive: true,
      "lengthMenu": [5, 10, 25,50]
      } );
      }, 1000);
      
        this.getAllProject();
        this.taskService.getTaskChangesList().subscribe((data:any)=>{    this.changes = data})
  
        
  }

  public getAllProject()
  {
    this.projectService.getProjectList().subscribe((res)=>
    {
      let list =  res as Project[]
      this.dataSource = new MatTableDataSource(list);

    } )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  fn_edit()
  {
    alert("Edit")
  }
  fn_getData(data){
    alert("Hello Click function."+data);
  }
  fn_Change2(s:any)
  {
   
    
  //   let index = this.options.findIndex(x => x === s);
  //   console.log(index);
  //   for(let i=0;i<=index;i++)
  //   {
  //     delete this.options[index];

  //   }
  //  console.log(this.options) 

  console.log(s);

     

  if(s =='Queue' )
  {

    
    this.options = ['Queue','Assign','Cancelled'];



  }
  else if(s=="Assign")
  {
    this.options = ['Assign','Started','ON hold','Cancelled'];
    // this.taskmodel.startOn =null;

   

  }

  else if (s=='Started')
  {
    this.options = ['Assign','Started','ON hold','Cancelled','Completed'];

  }
  else if (s=='ON hold')
  {
  

    this.options = ['Started','Completed','ON hold','Cancelled'];

  }
  else if (s=='Completed')
  {
  



  }
  else if (s=='Cancelled')
  {


  }


  }
}
