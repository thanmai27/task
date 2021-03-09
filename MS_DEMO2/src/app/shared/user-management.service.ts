import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { User} from './usermanagement.model'


var token = sessionStorage.getItem('token')
 
const httpOptions = {
  headers: new HttpHeaders({
    "Authorization":"Bearer " + token,
  })
};
// console.log(httpOptions);
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  selectedUser:User;
  users: User[];


   constructor(private http:HttpClient) { }
   readonly baseURL = "http://localhost:3000/user";

   totalCount()
   {
    return this.http.get(this.baseURL+`/totalusers`,httpOptions);

   }
   leadIsActive()
   {
     return this.http.get(this.baseURL+`/leadisactive`);
 
   }
   memberIsActive()
   {
     return this.http.get(this.baseURL+`/memberisactive`);
 
   }

   postUser(user:User)
   {
      return this.http.post(this.baseURL,user,httpOptions)
   }
   putUser(user: User) {
    return this.http.put(this.baseURL + `/${user._id}`, user,httpOptions);
  }
   getUserList()
  {
    return this.http.get(this.baseURL,httpOptions);
  }
  userDisable(userId:any) {
  console.log("serviceID",userId)
    return this.http.put(this.baseURL+`/enable`+`/${userId}`,userId, httpOptions);
  }
  userEnable(userId:any) {
    console.log("serviceID",userId)
      return this.http.put(this.baseURL+`/disable`+`/${userId}`,userId,httpOptions);
    }

    getTeamLeadList()
    {
      return this.http.get(this.baseURL+`/teamlead`,httpOptions);

    }

    getTeamMemberList()
    {
      return this.http.get(this.baseURL+`/member`,httpOptions);

    }
    // patchTeamMemberList()
    // {
    //   return this.http.patch(this.baseURL+`/member`,httpOptions);
    // }
}
