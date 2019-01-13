import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DeviceConnectionService } from '../../services/device-connection/device-connection.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnInit {
  timerControl: String = 'reset';
  time: any = 60 * 30 * 1000;
  timerSize: any = 25;

  @ViewChild('wrapper') wrapperRef: ElementRef;

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

    let height = this.wrapperRef.nativeElement.getBoundingClientRect().height;

    let baseSize = Math.round((height / 100) * size * 0.7);

    return `${baseSize}px`;
  }
}
