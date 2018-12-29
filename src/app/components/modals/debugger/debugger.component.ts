import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoggerService } from '../../../services/logger/logger.service';
import { DeviceConnectionService } from '../../../services/device-connection/device-connection.service';
import * as format from 'date-fns/format';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit {
  tab: string = 'reset';
  apiPath: string = '';
  apiPayload: string = '';
  debugTapCount: number = 0;

  constructor(
    private modalController: ModalController,
    private logger: LoggerService,
    private deviceConnectionService: DeviceConnectionService,
  ) { }

  ngOnInit() {}

  debugTap() {
    this.tab = 'api';
  }

  resetDevice() {
    this.close()
      .then(() => {
        this.deviceConnectionService.reset();
      });
  }

  timeFormat(date) {
    return format(date, 'YYYY-MM-DD h:mm:ssa');
  }

  dataFormat(data) {
    if (typeof data === 'string' || data instanceof String) {
      return data;
    }

    return JSON.stringify(data, null, 2);
  }

  rowsCount(data) {
    return data.split('\n').length;
  }

  close() {
    return this.modalController.dismiss();
  }

  clear() {
    this.logger.clear();
  }

  tabClicked(tab) {
    this.tab = tab;
  }

  onAPISubmit() {
    let payload;
    if (!this.apiPath) {
      return;
    }

    try {
      payload = JSON.parse(this.apiPayload);
    } catch (e) {
      return;
    }
    
    this.modalController.dismiss()
      .then(async () => {
        this.logger.log(`API PATH: ${this.apiPath}`);
        this.logger.log(payload);

        const result = await this.deviceConnectionService.listeners[this.apiPath](payload);

        this.logger.log('API RESULT');
        this.logger.log(result);
      });
  }

  apiPopulate(call) {
    switch (call) {
      case 'handshake':
        this.apiPath = '/api/handshake';
        this.apiPayload = '{\n  "ipaddress": "127.0.0.1",\n  "port": 8333,\n  "token": "abc123"\n}';
      break;
      case 'timerStart':
        this.apiPath = '/api/timer/control';
        this.apiPayload = '{\n  "time": "120000",\n  "control": "start"\n}';
      break;
      case 'timerStop':
        this.apiPath = '/api/timer/control';
        this.apiPayload = '{\n "control": "stop"\n}';
      break;
      case 'timerReset':
        this.apiPath = '/api/timer/control';
        this.apiPayload = '{\n"control": "reset"\n}';
      break;
    }
  }
}
