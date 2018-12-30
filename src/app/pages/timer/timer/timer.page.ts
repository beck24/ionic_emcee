import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DeviceConnectionService } from '../../../services/device-connection/device-connection.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnInit {
  timerControl: String = 'reset';
  time: any = '120000';
  timerSize: any = 25;

  constructor(
    private deviceConnectionService: DeviceConnectionService,
    private toastCtrl: ToastController,
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
      return new Promise(async (resolve) => {
        console.log(payload);

        if (payload.hasOwnProperty('time')) {
          this.time = payload.time;
        }

        if (payload.hasOwnProperty('control')) {
          this.timerControl = payload.control;
        }

        if (payload.hasOwnProperty('timerSize')) {
          this.timerSize = payload.timerSize;
        }

        if (payload.hasOwnProperty('message')) {
          const toast = await this.toastCtrl.create({
            message: payload.message,
            duration: 5000,
            position: 'top',
            color: 'primary',
          });
          toast.present();
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

  fontSize() {
    let size = parseInt(this.timerSize);

    size = size > 0 && size < 100 ? size : 25;

    return `${size}vh`;
  }
}
