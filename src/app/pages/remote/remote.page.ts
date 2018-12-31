import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-remote',
  templateUrl: './remote.page.html',
  styleUrls: ['./remote.page.scss'],
})
export class RemotePage implements OnInit {
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
}
