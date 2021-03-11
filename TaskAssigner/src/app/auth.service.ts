import { Injectable } from '@angular/core';
import {BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';

import { OAuthSettings } from '../app/outh';
import {Router} from '@angular/router'

import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 clientname:string;
 isUser=false;
 loggedIn = false;
 email: any;
buttonValue:any;  

readonly baseURL = "http://localhost:3000";


  constructor(private http:HttpClient,private broadcastService: BroadcastService,private authService: MsalService, private router: Router) { }
  ngOnInit() {

    console.log(sessionStorage.getItem('loggedUserinfo'));
    var loggedUserdetails=JSON.parse(sessionStorage.getItem('loggedUserinfo'));
    console.log(loggedUserdetails);
    this.clientname=loggedUserdetails.user;

    this.checkoutAccount();

    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkoutAccount();
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response.accessToken);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }

  checkoutAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }
  LogIn()
  {
    this.buttonValue =JSON.parse(sessionStorage.getItem('buttonValue'));
    console.log("login",this.buttonValue);
    
        return this.http.get(this.baseURL+"/authCredentials/"+this.buttonValue)

  }

  fn_LogOut()
  {
    debugger;
    this.email=JSON.parse(sessionStorage.getItem('email'));
    console.log(this.email);
 
    
    this.buttonValue =JSON.parse(sessionStorage.getItem('buttonValue'));
    console.log("auth btn value...",this.buttonValue)
    this.http.patch(this.baseURL+"/logout", this.email).subscribe((ress:any)=>console.log("logout result:",ress))
    // if( this.buttonValue == "MS")
    // {
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   this.router.navigateByUrl('/')
    // }
    // else
    // {
    //   // https://www.facebook.com/logout.php?next=${process.env.redirect_uri}&access_token=${accessToken}
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   this.router.navigateByUrl('/')
    // }

    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('/logout')
 
  }   

// ms_Login(userId:any)
//   {​​​​​​​​
// console.log(userId)
// return this.http.post(this.baseURL+`/${​​​​​​​​userId}​​​​​​​​`,userId)
//   }​​​​​​​​

fn_GetToken(code:any)
{
  var authCodeSend={"Code":code};
  
  console.log(authCodeSend);
  console.log(this.baseURL+"/code");
  
  return this.http.post(this.baseURL+"/code",authCodeSend)


}
fn_FbGetToken(code:any)
{
  var authCodeSend={"Code":code};
  
  console.log(authCodeSend);
  console.log(this.baseURL+"/oauth-redirect");
  

  return this.http.post(this.baseURL+"/oauth-redirect",authCodeSend)
  
}


}
