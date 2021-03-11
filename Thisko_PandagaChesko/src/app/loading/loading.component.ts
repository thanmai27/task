import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  public href: string = "";
  url: string = "";
  code: any;
  jwtToken: any;
  tokenLoaded = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authservice: AuthService) { }

  ngOnInit() {

    $(document).attr("title", "TaskAssigner - verify");

    var btn = JSON.parse(sessionStorage.getItem('buttonValue'));

    this.href = this.router.url;
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];

    })

    if (btn === "MS") {
      this.authservice.fn_GetToken(this.code).subscribe((res: any) => {
        console.log(res)

        if (res.result != null || res.result != undefined) {

          const loggedUserName = { userName: res.result.displayName };
          const loggedMsEmail = { email: res.result.mail }
          this.jwtToken = res.jwt;
          console.log(this.jwtToken);


          sessionStorage.setItem('loggedUserName', JSON.stringify(loggedUserName));
          sessionStorage.setItem('email', JSON.stringify(loggedMsEmail));
          sessionStorage.setItem('token', this.jwtToken);
           this. tokenLoaded = true;
          this.router.navigateByUrl('/dashboard')
        }
        else {
          this.router.navigateByUrl('/')

        }

      })
    } else {
      this.authservice.fn_FbGetToken(this.code).subscribe((res: any) => {
        // console.log(res)

        // this.router.navigateByUrl('/dashboard')

        if (res.result != null || res.result != undefined)  {
          const loggedUserName = { userName: res.result.name };
          const loggedFbEmail = { email: res.result.email };
          this.jwtToken = res.jwt;

          console.log(this.jwtToken);

          sessionStorage.setItem('token', this.jwtToken);
          sessionStorage.setItem('loggedUserName', JSON.stringify(loggedUserName));
          sessionStorage.setItem('email', JSON.stringify(loggedFbEmail));

          this.router.navigateByUrl('/dashboard')
        }
        else {
          this.router.navigateByUrl('/')

        }

      })
    }


  }


}