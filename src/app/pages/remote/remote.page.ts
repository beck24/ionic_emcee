import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform, PickerController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DeviceConnectionService } from '../../services/device-connection/device-connection.service';

@Component({
  selector: 'app-remote',
  templateUrl: './remote.page.html',
  styleUrls: ['./remote.page.scss'],
})
export class RemotePage implements OnInit {
  previewTimerControl: String = 'reset';
  previewTimerSize: any = 25;
  previewTime: any = 60 * 30 * 1000;
  previewMessage: String = '';

  timerControl: String = 'reset';
  time: any = 60 * 30 * 1000;
  timerSize: any = 25;

  pickerHour: number = 0;
  pickerMinute: number = 30;
  pickerSecond: number = 0;

  view: any = 'controls';
  message: String = '';

  @ViewChild('wrapper') wrapperRef: ElementRef;

  constructor(
    private platform: Platform,
    private pickerCtrl: PickerController,
    private screenOrientation: ScreenOrientation,
    private deviceConnectionService: DeviceConnectionService,
  ) { }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  ionViewWillLeave() {
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }
  }

  fontSize() {
    let size = parseInt(this.previewTimerSize);

    let height = this.wrapperRef.nativeElement.getBoundingClientRect().height;

    let baseSize = Math.round((height / 100) * size * 0.7);

    return `${baseSize}px`;
  }

  setView(view) {
    this.view = view;
  }

  setControl(control) {
    this.timerControl = control;

    this.sendControl('controls');
  }

  sendControl(type) {
    let callback: any = () => {};
    const payload: any = {};

    switch (type) {
      case 'controls':
        payload.timerControl = this.timerControl;

        callback = (result) => {
          if (result.hasOwnProperty('timerControl')) {
            this.previewTimerControl = result.timerControl;
          }
        };

      break;
      case 'timer':
        payload.time = this.time;

        callback = (result) => {
          console.log('callback result');
          console.log(result);

          if (result.hasOwnProperty('time')) {
            this.previewTime = result.time;
          }
        };
      break;
      case 'font':
        payload.timerSize = this.timerSize;

        callback = (result) => {
          if (result.hasOwnProperty('timerSize')) {
            this.previewTimerSize = result.timerSize;
          }
        };
      break;
      case 'message':
        payload.message = this.message;

        callback = (result) => {
          if (result.hasOwnProperty('message')) {
            this.previewMessage = result.message;

            this.message = '';
          }
        }
      break;
    }

    if (!this.platform.is('cordova')) {
      callback(payload);
      return;
    }

    this.deviceConnectionService.callApi('/api/timer/control', payload)
      .then((result) => {
        callback(result);
      })
      .catch((error) => {
        console.log('make an error');
        console.log(error);
      });
  }

  async timePicker() {
    const hours = [];
    const minutes = [];
    const seconds = [];

    for (let i = 0; i < 100; i++) {
      hours.push({
        text: i < 10 ? `0${i}` : `${i}`,
        value: i,
      });
    }

    for (let i = 0; i < 60; i++) {
      minutes.push({
        text: i < 10 ? `0${i}` : `${i}`,
        value: i,
      });

      seconds.push({
        text: i < 10 ? `0${i}` : `${i}`,
        value: i,
      });
    }

    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: 'Done',
        handler: (result) => {
          let ms = 0;

          if (result.seconds) {
            ms += (result.seconds.value * 1000);
          }

          if (result.minutes) {
            ms += (result.minutes.value * 60 * 1000);
          }

          if (result.hours) {
            ms += (result.hours.value * 60 * 60 * 1000);
          }

          this.pickerHour = result.hours.value;
          this.pickerMinute = result.minutes.value;
          this.pickerSecond = result.seconds.value;
          this.time = ms;
        }
      }],
      columns: [
        {
          name: 'hours',
          options: hours,
          selectedIndex: this.pickerHour,
        },
        {
          name: 'minutes',
          selectedIndex: this.pickerMinute,
          options: minutes,
        },
        {
          name: 'seconds',
          options: seconds,
          selectedIndex: this.pickerSecond,
        }
      ],
    });
    await picker.present();
  }

  pickerIntervalFormat(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
