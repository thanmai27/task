import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Taskdemo } from '../model/taskdemo.model';




@Injectable({
  providedIn: 'root'
})
export class TaskdemoService {

  selectedTask:Taskdemo;
  tasks: Taskdemo[];
  constructor(private http:HttpClient) { }

  readonly baseURL = "http://localhost:3000/taskdemo";

  token = sessionStorage.getItem('token')
 
  httpOptions = {
    headers: new HttpHeaders({
      "Authorization":"Bearer " + this.token,
    })
  };

  totalCount()
  {
   return this.http.get(this.baseURL+`/totaltasks`,this.httpOptions);

  }
  getTaskList()
  {
    return this.http.get(this.baseURL, this.httpOptions);
  }
  getOneTask(taskId:any)
  {
    console.log(this.baseURL +`/${taskId}`)
    return this.http.get(this.baseURL +`/${taskId}`, this.httpOptions);

  }
  getTotalTaskInProject(projectName)
  {
    return this.http.get(this.baseURL + "/getprojectName"+`/${projectName}`, this.httpOptions);

  }

    getDetailsOfTaskInProject(projectName)
  {
    return this.http.get(this.baseURL + "/getprojectdetails"+`/${projectName}`, this.httpOptions);

  }
  getTaskStatus(taskStatus)
  {
    return this.http.get(this.baseURL + "/gettaskstatus"+`/${taskStatus}`, this.httpOptions);

  }

  getDetailsOfTaskStatus(taskStatus)
  {
    return this.http.get(this.baseURL + "/gettaskstatusdetails"+`/${taskStatus}`, this.httpOptions);

  }
  getTaskChangesList()
  {
    return this.http.get(this.baseURL + "/changes", this.httpOptions);
  }
  getchange(taskId:any)
  {
    return this.http.get(this.baseURL + "/changes"+`/${taskId}`, this.httpOptions);

  }
  postTask(task:Taskdemo)
  {
     return this.http.post(this.baseURL,task, this.httpOptions)
  }
  putTask(task:Taskdemo) {
    return this.http.put(this.baseURL + `/${task._id}`, task, this.httpOptions);
  }

}
