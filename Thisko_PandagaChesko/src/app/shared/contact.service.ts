import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Contact} from './contact.model';


 
@Injectable({
  providedIn: 'root'
})
export class ContactService {
selectedConatct:Contact;

   constructor(private http:HttpClient) { }
   token = sessionStorage.getItem('token')
 
   httpOptions = {
     headers: new HttpHeaders({
       "Authorization":"Bearer " + this.token,
     })
   };

  readonly baseURL = "http://localhost:3000/contact";

  postContact(contact:Contact)
  {
     return this.http.post(this.baseURL,contact, this.httpOptions)   
  }
}
