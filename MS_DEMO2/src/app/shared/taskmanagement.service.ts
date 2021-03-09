import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Task } from '../model/task.model';

var token = sessionStorage.getItem('token')
 
const httpOptions = {
  headers: new HttpHeaders({
    "Authorization":"Bearer " + token,
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskmanagementService {

  selectedTask:Task;
  tasks: Task[];
  constructor(private http:HttpClient) { }

  readonly baseURL = "http://localhost:3000/task";

  getTaskList()
  {
    return this.http.get(this.baseURL, httpOptions);
  }

  getTaskChangesList()
  {
    return this.http.get(this.baseURL + "/changes", httpOptions);
  }
  getchange(taskId:any)
  {
    return this.http.get(this.baseURL + "/changes"+`/${taskId}`, httpOptions);

  }
  postTask(task:Task)
  {
     return this.http.post(this.baseURL,task, httpOptions)
  }
  putTask(task:Task) {
    return this.http.put(this.baseURL + `/${task._id}`, task, httpOptions);
  }


  downloadFile(data, filename='data') {
    let csvData = this.ConvertToCSV(data, ['projectName','teamMember', 'taskStatus', 'createdOn', 'assignOn','startOn','endOn']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

ConvertToCSV(objArray, headerList) {
     let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
     let str = '';
     let row = 'S.No,';

     for (let index in headerList) {
         row += headerList[index] + ',';
     }
     row = row.slice(0, -1);
     str += row + '\r\n';
     for (let i = 0; i < array.length; i++) {
         let line = (i+1)+'';
         for (let index in headerList) {
            let head = headerList[index];

             line += ',' + array[i][head];
         }
         str += line + '\r\n';
     }
     return str;
 }
}
