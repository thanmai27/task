import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Taskdemo } from '../model/taskdemo.model';

var token = sessionStorage.getItem('token')
 
const httpOptions = {
  headers: new HttpHeaders({
    "Authorization":"Bearer " + token,
  })
};


@Injectable({
  providedIn: 'root'
})
export class TaskdemoService {

  selectedTask:Taskdemo;
  tasks: Taskdemo[];
  constructor(private http:HttpClient) { }

  readonly baseURL = "http://localhost:3000/taskdemo";


  totalCount()
  {
   return this.http.get(this.baseURL+`/totaltasks`,httpOptions);

  }
  getTaskList()
  {
    return this.http.get(this.baseURL, httpOptions);
  }
  getOneTask(taskId:any)
  {
    console.log(this.baseURL +`/${taskId}`)
    return this.http.get(this.baseURL +`/${taskId}`, httpOptions);

  }

  getTaskChangesList()
  {
    return this.http.get(this.baseURL + "/changes", httpOptions);
  }
  getchange(taskId:any)
  {
    return this.http.get(this.baseURL + "/changes"+`/${taskId}`, httpOptions);

  }
  postTask(task:Taskdemo)
  {
     return this.http.post(this.baseURL,task, httpOptions)
  }
  putTask(task:Taskdemo) {
    return this.http.put(this.baseURL + `/${task._id}`, task, httpOptions);
  }

}
