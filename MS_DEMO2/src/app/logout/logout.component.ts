import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router : Router) { }
  images= ['../../assets/images/1.jpg',
'../../assets/images/2.jpg',
'../../assets/images/3.jpg',
'../../assets/images/4.jpg',
'../../assets/images/5.jpg',
'../../assets/images/6.jpg',
'../../assets/images/7.jpg'];
 
  backgroundImage: string = '';
 
  ngOnInit() {

    $(document).attr("title", "TaskAssigner - Logout");

    let ran = Math.round((Math.random() * 6) + 1)
    // Math.round((Math.random()*100)%5);
    console.log(ran)
    this.backgroundImage = this.images[ran];
 
  }
  fn_Relogin()
  {
    this.router.navigateByUrl('/')
  }
}
