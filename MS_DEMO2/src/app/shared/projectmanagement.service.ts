import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Project } from '../model/project.model';

var token = sessionStorage.getItem('token')
 
const httpOptions = {
  headers: new HttpHeaders({
    "Authorization":"Bearer " + token,
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectmanagementService {
  selectedProject:Project;
  projects: Project[];

  constructor(private http:HttpClient) { }

  readonly baseURL = "http://localhost:3000/project";


  totalCount()
  {
   return this.http.get(this.baseURL+`/totalprojects`,httpOptions);

  }

  getProjectList()
  {
    return this.http.get(this.baseURL, httpOptions);
  }
  getOneProjectList(Id)
  {
    return this.http.get(this.baseURL+ `/${Id}`, httpOptions);
  }
  selectProject(projectName)
  {
    return this.http.get(this.baseURL +`/find/${projectName}`, httpOptions);
  }
  postProject(project:Project)
  {
     return this.http.post(this.baseURL,project, httpOptions)
  }
  putProject(project: Project) {
    return this.http.put(this.baseURL + `/${project._id}`, project, httpOptions);
  }
  isMap(userId:any) {
      return this.http.put(this.baseURL+`/ismap`+`/${userId}`,userId, httpOptions);
    }
  isUnMap(userId:any) {
      return this.http.put(this.baseURL+`/isunmap`+`/${userId}`,userId, httpOptions);
    }

}
