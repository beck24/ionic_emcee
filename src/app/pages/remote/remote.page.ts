import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-remote',
  templateUrl: './remote.page.html',
  styleUrls: ['./remote.page.scss'],
})
export class RemotePage implements OnInit {
  timerControl: String = 'reset';
  time: any = '120000';
  timerSize: any = 25;
  previewTimerSize: any = 25;

  @ViewChild('wrapper') wrapperRef: ElementRef;

  constructor(
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
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
}
