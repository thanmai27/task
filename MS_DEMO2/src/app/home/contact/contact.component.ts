import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// import {ContactService } from '../../shared/contact.service';
import {ContactService } from '../../shared/contact.service';
import {Contact} from '../../shared/contact.model';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  msg;
  public emailshow;
  public phoneshow;
formData:any = [];
  user = {
    message: '',
    fileContent :''
  };
  path:any;
  contacts = new Contact();
    constructor(private toastr: ToastrService,private contactService:ContactService) { }

  ngOnInit() {
    this.emailshow =false;
    this.phoneshow=false; 
    this.Fn_Clear()
   }


Fn_Clear(form?:NgForm)
{
  if(form)
  {
    form.reset();
    this.contacts = {
      type: '',
  severity: '',
  subject:'',
  description: '',
  modeofcontact:'',
  email:'',
  cc:'',
  contact:null,
   attachment:''

    }
  }
}

 fn_changeMandatory(event)
{
console.log(event.target.value)
if(event.target.value ==1)
{
  this.emailshow = true;
  this.phoneshow=false;
}
else
{
  this.phoneshow=true;
  this.emailshow = false;

}

}

upload(event) {
  let fileList: FileList = event.target.files;
  if(fileList.length > 0) {
       let file: File = fileList[0];
       this.formData = new FormData();
       this.formData.append('attachment', file, file.name);
       let headers = new Headers();
       /** No need to include Content-Type in Angular 4 */
       headers.append('Content-Type', 'multipart/form-data');
       headers.append('Accept', 'application/json');
  if(event.target.files.length > 0) 
   {
     console.log(event.target.files[0]);
     this.path = event.target.files[0].name
     
   }
 }
}
 
 Fn_Submit(form:NgForm)
  {
debugger;
 
this.formData.append('type',form.value.type);
this.formData.append('severity', form.value.severity);
this.formData.append('subject', form.value.subject);
this.formData.append('description',form.value.description);
this.formData.append('modeofcontact', form.value.modeofcontact);
this.formData.append('email', form.value.email);
this.formData.append('cc', form.value.cc);
this.formData.append('contact',form.value.contact);
    // this.contacts = form.value;
    
    console.log(this.formData)
    this.formData.forEach((value,key) => {
      console.log(key+" "+value)
    });
    this.contactService.postContact(this.formData).subscribe((data) =>
      {
        console.log(data)
      this.toastr.success("Data Added Successfully","Your Request has sent !!!",
      {
        timeOut:2000,
        
      });
      this.Fn_Clear(form);
      this.emailshow = false;
      this.phoneshow = false;
      window.location.reload();
    }
    
   );
 
  }

}
