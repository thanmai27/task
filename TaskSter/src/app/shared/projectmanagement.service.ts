import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Project } from '../model/project.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectmanagementService {
  selectedProject:Project;
  projects: Project[];

  constructor(private http:HttpClient) { }

  readonly baseURL = "http://localhost:3000/project";

  token = sessionStorage.getItem('token')
 
  httpOptions = {
  headers: new HttpHeaders({
    "Authorization":"Bearer " + this.token,
  })
};


  totalCount()
  {
   return this.http.get(this.baseURL+`/totalprojects`,this.httpOptions);

  }

  getProjectList()
  {
    return this.http.get(this.baseURL, this.httpOptions);
  }
  getOneProjectList(Id)
  {
    return this.http.get(this.baseURL+ `/${Id}`, this.httpOptions);
  }
  selectProject(projectName)
  {
    return this.http.get(this.baseURL +`/find/${projectName}`, this.httpOptions);
  }
  postProject(project:Project)
  {
     return this.http.post(this.baseURL,project, this.httpOptions)
  }
  putProject(project: Project) {
    return this.http.put(this.baseURL + `/${project._id}`, project, this.httpOptions);
  }
  isMap(userId:any) {
      return this.http.put(this.baseURL+`/ismap`+`/${userId}`,userId, this.httpOptions);
    }
  isUnMap(userId:any) {
      return this.http.put(this.baseURL+`/isunmap`+`/${userId}`,userId, this.httpOptions);
    }

}
