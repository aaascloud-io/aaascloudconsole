import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { Select } from 'src/app/_common/_interface/select';
import { Command } from 'src/app/_common/_interface/Command';
import { ShowcommandComponent } from './showcommand/showcommand.component';

export const SUBNAMES: Select[] = [
  { id: '0', value: 'StreetLightBasic' },
  { id: '1', value: 'ifocus' }
];

export const COMMANDNAMES: Select[] = [
  { id: '0', value: 'SWITCH' },
  { id: '1', value: 'UDP' }
];

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.css']
})

export class CommandComponent implements OnInit {
  private ssid = '';
  private deviceName = '';
  subnames = SUBNAMES;
  commandnames = COMMANDNAMES;
  @ViewChild('showcommand')
  private showcommandComponent: ShowcommandComponent
  constructor(private httpService: HttpService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.ssid = this.activatedRoute.snapshot.queryParams["ssid"]
    this.deviceName = this.activatedRoute.snapshot.queryParams["deviceName"]

  }
  /**
   *  命令放送
   * @param paras 
   */
  send(command: string, subname: string, commandName: string): void {
    let commandForm = {
      ssid: this.ssid,
      // 操作時間
      command: command,
      // requestHead
      subname: subname,
      // requestBody
      commandName: commandName
    };
    this.httpService.usePost('pfApi/send', commandForm).then(data => {
      try {
        try {
          if (data.result) {
            let command: Command = {
              senddate: data.senddate,
              header: data.header,
              body: data.body
            }
            this.showcommandComponent.setcommand(command);
            console.log('httpService ok');
          }
        } catch (e) {
          console.log(e);
        }

      } catch (e) {
        console.log('httpService エラー　発生しました。');
      }

    })
  }
}
