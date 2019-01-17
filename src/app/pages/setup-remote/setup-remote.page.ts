import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { DeviceConnectionService } from '../../services/device-connection/device-connection.service';
import { RemoteinfoComponent } from '../../components/modals/remoteinfo/remoteinfo.component';

@Component({
  selector: 'app-setup-remote',
  templateUrl: './setup-remote.page.html',
  styleUrls: ['./setup-remote.page.scss'],
})
export class SetupRemotePage implements OnInit {
  stateLoaded: boolean = true;
  errors: Array<String> = [];

  constructor(
    private deviceConnectionService: DeviceConnectionService,
    private navCtrl: NavController,
    private platform: Platform,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  reset() {
    this.navCtrl.navigateBack('/');
  }

  scan() {
    if (!this.platform.is('cordova')) {
      this.navCtrl.navigateForward('/remote');
      return;
    }

    this.deviceConnectionService.scanSetup()
      .then(() => {
        this.navCtrl.navigateForward('/remote');
      })
      .catch((error) => {
        console.log('scan error', error);
        this.errors.push(error);
      });
  }

  async detailsModal() {
    const modal = await this.modalCtrl.create({
      component: RemoteinfoComponent,
      backdropDismiss: false,
    });

    modal.present();
  }
}
