import { Component, Input, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import {AuthService} from '../auth.service';
import { OAuthSettings } from './../outh';
import { OAuthFBSettings } from './../fbOAuth';

import { Router } from '@angular/router'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  show = false;
  btnValue:any
  val:any
 
//   images= ['../../assets/images/1.jpg',
// '../../assets/images/2.jpg',
// '../../assets/images/3.jpg',
// '../../assets/images/4.jpg',
// '../../assets/images/5.jpg',
// '../../assets/images/6.jpg',
// '../../assets/images/7.jpg'];

 msg: string = '';
 
 backgroundImage: string = '';
  constructor(private authservice:AuthService,private msalService: MsalService) { }

  ngOnInit() {

  
    // let ran = Math.round((Math.random() * 6) + 1)
    // Math.round((Math.random()*100)%5);
    // this.backgroundImage = this.images[ran];

    // var urls = ['../../assets/images/image6.jpeg',
    // '../../assets/images/image1.jpg',
    // '../../assets/images/image2.jpg',
    // '../../assets/images/image3.jpg',
    // '../../assets/images/image5.jpg',
    // '../../assets/images/image4.jpg'];

    // var cout = 1;
    // $('body').css('background-image', 'url("' + urls[0] + '")');
    // setInterval(function() {
    //   $('body').css('background-image', 'url("' + urls[cout] + '")');
    //   cout == urls.length-1 ? cout = 0 : cout++;
    // }, 5000);
    // background-image: no-repeat;
    // background-size: cover;
    var url='assets/images/loggin.jpg';
    $('body').css('background-image', 'url("' + url + '")');
    $('body').css('background-image', 'no-repeat');
    $('body').css('background-size', 'fixed');
    // $('body').css('background-image', 'linear-gradient(to right, grey , yellow)');



    $(document).attr("title", "TaskAssigner - Login");


  }

  Fn_Login(data)
  {
    this.btnValue= $('#btn_ms').val();
 
    const loggedUserInfo={user:data.email};
    sessionStorage.setItem('buttonValue',JSON.stringify( this.btnValue));
 
    if(data.email == '' )
    {
      this.msg="Username is required..!!"
      // alert("Please Enter UserID");
     
      return;
    }
 
    else
    {
      var s =JSON.stringify(data.email)
      sessionStorage.setItem('loggedUserinfo',JSON.stringify(loggedUserInfo));
 
      this.authservice.LogIn().subscribe((result:any)=>{
        
        console.log(result);
        window.location.href  ="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=" + result.clientId+ "&response_type=code&redirect_uri=" + result.redirectUri+ "&response_mode=query&scope=https://graph.microsoft.com/" + result.scopes[0] + "&state=12345&login_hint=" + data.email;
      
      })
      
 
   
    }
 
  }
 
  fn_Fblogin()
  {
    this.btnValue = $('#btn_fb').val();
    sessionStorage.setItem('buttonValue',JSON.stringify( this.btnValue));
 
    this.authservice.LogIn().subscribe((result:any)=>{
        
      console.log(result);
     window.location.href ="https://www.facebook.com/v9.0/dialog/oauth?client_id="+result.clientId+"&redirect_uri="+result.redirectUri+"&scope=public_profile,email"
    
    })
  }

}
