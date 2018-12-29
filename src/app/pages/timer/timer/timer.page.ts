import { Component, OnInit } from '@angular/core';
import { DeviceConnectionService } from '../../../services/device-connection/device-connection.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnInit {
  timerControl: String = 'reset';
  time: any = '120000';

  constructor(
    private deviceConnectionService: DeviceConnectionService
  ) { }

  ngOnInit() {
    this.registerAPIControls();
  }

  ngOnDestroy() {
    this.unRegisterAPIControls();
  }

  cdResult($event) {
    console.log('cdResult', $event);
  }

  registerAPIControls() {
    this.deviceConnectionService.registerListener('/api/timer/control', (payload: any = {}) => {
      return new Promise((resolve) => {
        console.log(payload);

        if (payload.hasOwnProperty('time')) {
          this.time = payload.time;
        }

        if (payload.hasOwnProperty('control')) {
          this.timerControl = payload.control;
        }

        resolve({
          status: 200,
          body: '',
        });
      });
    });
  }

  unRegisterAPIControls() {
    this.deviceConnectionService.unregisterListener('/api/timer/control');
  }
}
