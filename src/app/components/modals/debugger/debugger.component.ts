import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoggerService } from '../../../services/logger/logger.service';
import * as format from 'date-fns/format';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private logger: LoggerService,
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
}
