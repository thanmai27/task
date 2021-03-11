import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router : Router) { }
 
 
  ngOnInit() {
    // var urls = ['../../assets/images/1.jpg',
    // '../../assets/images/2.jpg',
    // '../../assets/images/3.jpg',
    // '../../assets/images/4.jpg',
    // '../../assets/images/5.jpg',
    // '../../assets/images/6.jpg',
    // '../../assets/images/7.jpg'];

    // var cout = 1;
    // $('body').css('background-image', 'url("' + urls[0] + '")');
    // setInterval(function() {
    //   $('body').css('background-image', 'url("' + urls[cout] + '")');
    //   cout == urls.length-1 ? cout = 0 : cout++;
    // }, 5000);
    var url='assets/images/image3.jpg';
    $('body').css('background-image', 'url("' + url + '")');
    $(document).attr("title", "TaskAssigner - Logout");

   
  }

  fn_Relogin()
  {
    this.router.navigateByUrl('/')
  }
}
