import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserManagementService } from '../../shared/user-management.service'
import * as $ from 'jquery';
import {DataTablesModule} from 'angular-datatables';


import { User } from 'src/app/shared/usermanagement.model';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [UserManagementService]

})
export class UserManagementComponent implements OnInit {
  popoverTitle = 'Alert!!!';
  popoverMessage = 'Are you sure You want to Enable the user';
  popoverMessage2 = 'Are you sure You want to Disable the user';

  confirmClicked = false;
  cancelClicked = false
  isReadOnly=false;
  show = false;
  // isenabled = false;
  toggle = true;
  status = 'Enable';
  msg;
  usermodel = new User();
  sidebar= $('.main-sidebar ').show();
Icon='fas fa-expand'

  constructor(public userService: UserManagementService, private toastr: ToastrService) { }

  ngOnInit() {
    $(document).attr("title", "TaskAssigner - User");
    
    setTimeout(function () {
      $('table').DataTable({
        responsive: true,

        "lengthMenu": [5, 10, 25, 50]
      });
    }, 100);

    this.Fn_refreshUserList();
    this.Fn_resetForm();
  }

Fn_resetForm(form?:NgForm)
{
  if(form)
  form.reset()
    this.usermodel = {
      _id:"",
      role:"",
      email:"",
      name:"",
      phone:null,
      gender:"",
      isactive:false,
      isenabled:false,
      isExisitngMember:false,
      enableOrDisable:false

    }

  this.Fn_refreshUserList()
  $("#hide_content").hide();
}


Fn_refreshUserList() {
  this.userService.getUserList().subscribe((res) => {
    this.userService.users = res as User[];
   // console.log("on refresh",res)

  });
}
  Fn_AddUser() {
    setTimeout(()=>{      window.scrollTo(0, 600);    },100)

this.isReadOnly = false;
   this.show = true;

    $("#show_content").click(function () {
      $("#hide_content,#table-content").show();
    })
    this.Fn_resetForm();
  }


  Fn_Cancel(form: NgForm) {

    form.reset();
    // window.location.reload();
    this.Fn_refreshUserList()
    $("#hide_content").hide();
  }

  Fn_Edit(user: User) {

    setTimeout(()=>{      window.scrollTo(0, 600);    },100)

      this.usermodel = user;
    this.show = true;
    this.isReadOnly = true;
    //(document.getElementById("txt_Email") as HTMLInputElement).disabled = true;
    //$("#txt_Email").attr('readonly','readonly');


    $("#hide_content").show();


  }
  Fn_Enable(userId)
  {
    this.userService.userEnable(userId).subscribe(data=>console.log(data))
    this.toastr.warning("Success!!!","User was Disabled",
    {
      timeOut: 2000,
      progressAnimation: 'increasing',

    })
    $("#hide_content").hide();

    this.Fn_refreshUserList();
  }

  Fn_Disable(userId)
  {
    this.userService.userDisable(userId).subscribe(data=>console.log(data))
    this.toastr.success("Success!!!","User was Enabled",
    {
      timeOut: 2000,
      progressAnimation: 'increasing',

    })
    this.Fn_refreshUserList();

  }
  //  Fn_Enable(enableId, editUser) {
    // this.toggle = !this.toggle;
    // this.status = this.toggle ? 'Enable' : 'Disable';



  //  if (this.status == "Enable") {

  //     (document.getElementById(editUser) as HTMLInputElement).disabled = false;
  //     (document.getElementById(enableId) as HTMLInputElement).innerHTML = "Disable";
  //     (document.getElementById(enableId) as HTMLInputElement).style.backgroundColor = "red"

  //   }
  //   if(this.status == "Disable")
  //    {
  //     (document.getElementById(editUser) as HTMLInputElement).disabled = true;
  //     (document.getElementById(enableId) as HTMLInputElement).innerHTML = "Enable";
  //     (document.getElementById(enableId) as HTMLInputElement).style.backgroundColor = "#28a745";


  //    }



  //}
  Fn_Expand(){
  
    $('#user-management').toggleClass('fullscreen'); 
   // this.Icon='fas fa-compress'
    if (this.Icon == 'fas fa-expand'){
      this.Icon='fas fa-compress';
  } else {
    this.Icon='fas fa-expand';
  }
   !this.sidebar;
}

fn_SelectRow() 
{
$('#tabledata tbody').on('click', 'tr', function() {
  $('#tabledata tbody > tr').removeClass('high-light');
  $(this).addClass('high-light');
});
}

  Fn_Save(form: NgForm) {

    if (form.value._id == "") {
      this.usermodel = form.value;
      console.log(this.usermodel);

      this.userService.postUser(form.value).subscribe((data) => {
        form.resetForm();
        this.Fn_refreshUserList();
        console.log("The data is", data);
        this.toastr.success("Data Added Successguuly", "Your Request has sent !!!",
          {
            timeOut: 2000,
            progressAnimation: 'increasing',

          })
          $("#hide_content").hide();

      }, (error) => {
        this.msg = JSON.stringify(error.error);
        this.toastr.error(this.msg,"Error",
          {
            timeOut: 2000
          })
      }



      );
    }
    else {
      this.userService.putUser(form.value).subscribe((res) => {
      this.Fn_resetForm();
      this.Fn_refreshUserList();
        $("#hide_content").hide();

        this.toastr.success("Data Updated Successguuly", "Your Request has sent !!!",
          {
            timeOut: 2000,
            progressAnimation: 'increasing',

          })
      },
        (error) => {
          this.msg = JSON.stringify(error.error);
          this.toastr.error("Error", this.msg,
            {
              timeOut: 4000
            })
        });
    }



  }
}
