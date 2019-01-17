import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import QRCode from 'qrcode';

@Component({
  selector: 'app-remoteinfo',
  templateUrl: './remoteinfo.component.html',
  styleUrls: ['./remoteinfo.component.scss']
})
export class RemoteinfoComponent implements OnInit {
  swipeWidth = '100%';
  swipeHeight = '0px';
  qrcode = '';

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) { }

  ngOnInit() {
    let rawHeight = this.platform.height();
    let mod = 0.95;

    if (rawHeight >= 768) {
      mod = 0.7;
    }

    let height = Math.round(rawHeight * mod);

    this.swipeHeight = `${height}px`;

    QRCode.toDataURL('Hello World').then((code) => {
      this.qrcode = code;
    });
  }

  close() {
    return this.modalController.dismiss();
  }
}
