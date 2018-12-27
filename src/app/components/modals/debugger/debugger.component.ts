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
  tab: string = 'log';
  apiPath: string = '';
  apiPayload: string = '';

  constructor(
    private modalController: ModalController,
    private logger: LoggerService,
    private deviceConnectionService: DeviceConnectionService,
  ) { }

  ngOnInit() {
    console.log(this.logger.logs);
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
    this.modalController.dismiss();
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
        console.log('triggering after dismiss');
        console.log(this.apiPath);
        console.log(payload);

        const result = await this.deviceConnectionService.listeners[this.apiPath](payload);

        console.log(result);
      });
  }
}
