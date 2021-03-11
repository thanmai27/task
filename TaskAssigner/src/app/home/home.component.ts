import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import {AuthService} from '../auth.service'

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  profile;
clientname:any;

  constructor( private router:Router,private msal:MsalService,private http:HttpClient,private authservice:AuthService) { }

  ngOnInit() {
    var loggedUserdetails=JSON.parse(sessionStorage.getItem('loggedUserName'));
    // console.log(loggedUserdetails);
    this.clientname=loggedUserdetails.userName;
  }


Logout()
{

  this.authservice.fn_LogOut();
  


}

}
