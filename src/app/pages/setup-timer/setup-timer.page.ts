import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DeviceConnectionService } from '../../services/device-connection/device-connection.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-setup-timer',
  templateUrl: './setup-timer.page.html',
  styleUrls: ['./setup-timer.page.scss'],
})
export class SetupTimerPage implements OnInit {
  serverStarted: boolean = false;
  stateLoaded: boolean = true;
  errors: Array<string> = [];
  loading = null;

  constructor(
    public loadingController: LoadingController,
    public deviceConnectionService: DeviceConnectionService,
  ) { }

  ngOnInit() {}

  async startServer() {
    await this.showLoading();
    this.stateLoaded = false;
    this.errors = [];

    this.deviceConnectionService.startServer()
      .catch((error) => {
        this.errors.push(error);
      })
      .finally(() => {
        this.stateLoaded = true;
        this.hideLoading();
      });
  }

  async stopServer() {
    await this.showLoading();
    this.stateLoaded = false;
    this.errors = [];

    this.deviceConnectionService.stopServer()
      .catch((error) => {
        this.errors.push(error);
      })
      .finally(() => {
        this.stateLoaded = true;
        this.hideLoading();
      });
  }

  async showLoading() {
    return new Promise(async (resolve) => {
      if (this.loading) {
        resolve();
        return;
      }
  
      this.loading = await this.loadingController.create({
        spinner: 'dots',
      });
  
      await this.loading.present();

      resolve();
    });
  }

  async hideLoading() {
    return new Promise(async (resolve) => {
      if (!this.loading) {
        resolve();
        return;
      }
  
      await this.loading.dismiss();
      this.loading = null;

      resolve();
    });
  }
}
