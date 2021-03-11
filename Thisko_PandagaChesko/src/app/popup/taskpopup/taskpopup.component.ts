import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material'


@Component({
  selector: 'app-taskpopup',
  templateUrl: './taskpopup.component.html',
  styleUrls: ['./taskpopup.component.css']
})
export class TaskpopupComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data:any ) { }
datastring = JSON.stringify(this.data)

  ngOnInit() {

  }

}
