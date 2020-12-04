import { Component, OnInit } from '@angular/core';
import { Command } from 'src/app/_common/_interface/Command';

@Component({
  selector: 'app-showcommand',
  templateUrl: './showcommand.component.html',
  styleUrls: ['./showcommand.component.css']
})
export class ShowcommandComponent implements OnInit {
  senddate: string = '';
  header: string = '';
  body: string = '';

  constructor() { }

  ngOnInit() {

  }
  setcommand(commanddata: Command) {
    this.senddate = commanddata.senddate;
    this.header = commanddata.header;
    this.body = commanddata.body;
  }
  clearcommand() {
    this.senddate = '';
    this.header = '';
    this.body = '';
  }
}
