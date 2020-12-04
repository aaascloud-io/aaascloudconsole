import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-deivce',
  templateUrl: './deivce.component.html',
  styleUrls: ['./deivce.component.css']
})
export class DeivceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}