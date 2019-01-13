import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
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
  previewTime: any = '120000';

  timerControl: String = 'reset';
  time: any = '120000';
  timerSize: any = 25;

  view: any = 'controls';

  @ViewChild('wrapper') wrapperRef: ElementRef;

  constructor(
    private platform: Platform,
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

    console.log('sendcontrol');

    switch (type) {
      case 'controls':
        payload.timerControl = this.timerControl;

        callback = (result) => {
          console.log(result);
          if (result.hasOwnProperty('timerControl')) {
            this.previewTimerControl = result.timerControl;
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
      });
  }
}
