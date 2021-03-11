import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { User} from './usermanagement.model'



// console.log(httpOptions);
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  selectedUser:User;
  users: User[];


   constructor(private http:HttpClient) { }
   readonly baseURL = "http://localhost:3000/user";
   token = sessionStorage.getItem('token')
 
  httpOptions = {
  headers: new HttpHeaders({
    "Authorization":"Bearer " + this.token,
  })
};

   totalCount()
   {
    return this.http.get(this.baseURL+`/totalusers`,this.httpOptions);

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
      return this.http.post(this.baseURL,user,this.httpOptions)
   }
   putUser(user: User) {
    return this.http.put(this.baseURL + `/${user._id}`, user,this.httpOptions);
  }
   getUserList()
  {
    return this.http.get(this.baseURL,this.httpOptions);
  }
  userDisable(userId:any) {
  console.log("serviceID",userId)
    return this.http.put(this.baseURL+`/enable`+`/${userId}`,userId, this.httpOptions);
  }
  userEnable(userId:any) {
    console.log("serviceID",userId)
      return this.http.put(this.baseURL+`/disable`+`/${userId}`,userId,this.httpOptions);
    }

    getTeamLeadList()
    {
      return this.http.get(this.baseURL+`/teamlead`,this.httpOptions);

    }

    getTeamMemberList()
    {
      return this.http.get(this.baseURL+`/member`,this.httpOptions);

    }
    // patchTeamMemberList()
    // {
    //   return this.http.patch(this.baseURL+`/member`,httpOptions);
    // }
}
