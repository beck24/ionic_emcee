import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import QRCode from 'qrcode';

@Component({
  selector: 'app-setup-timer',
  templateUrl: './setup-timer.page.html',
  styleUrls: ['./setup-timer.page.scss'],
})
export class SetupTimerPage implements OnInit {
  serverStarted: boolean = false;
  stateLoaded: boolean = false;
  errors: Array<string> = [];
  loading = null;
  ipaddress = '';
  port = 8333;
  qrcode = '';

  constructor(
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    console.log('oninit called');
    this.startServer();
  }

  async startServer() {
    this.stateLoaded = false;
    this.errors = [];

    const webserver = window['webserver'];
    const networkInterface = window['networkinterface'];

    if (!webserver || !networkInterface) {
      console.log('webserver unavailable');
      this.stateLoaded = true;
      return;
    }

    await this.showLoading();

    const networkSuccess = (address) => {
      console.log(address);
      console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`);
      this.ipaddress = address.ip;

      webserver.onRequest(
        (request) => {
          webserver.sendResponse(
            request.requestId,
            {
              status: 200,
              body: '<html>Hello World</html>',
              headers: {
                'Content-Type': 'text/html'
              }
            }
          );
        }
      );
  
      const s = async () => {
        console.log('started');
        console.log('generate qr code');

        const payload = {
          address: this.ipaddress,
          port: this.port,
        };

        this.qrcode = await QRCode.toDataURL(JSON.stringify(payload))
        this.serverStarted = true;
        this.stateLoaded = true;
        await this.hideLoading();
      };
  
      const e = async (er) => {
        console.log('errored');
        console.log(er);
        this.errors.push('Cannot start server');
        this.errors.push(JSON.stringify(er));
        this.stateLoaded = true;
        await this.hideLoading();
      };
      
      webserver.start(s, e, this.port);
    };

    const networkError = async (error) => {
      console.error(`Unable to get IP: ${error}`);
      this.errors.push('Unable to get IP: ${error}');
      this.errors.push('Cannot detect WIFI connection');
      this.stateLoaded = true;
      await this.hideLoading();
    };

    networkInterface.getWiFiIPAddress(networkSuccess, networkError);
  }

  async stopServer() {
    this.stateLoaded = false;

    const webserver = window['webserver'];

    if (!webserver) {
      console.log('webserver unavailable');
      return;
    }

    await this.showLoading();

    const success = async () => {
      console.log('stopped!');
      this.qrcode = '';
      this.ipaddress = '';
      this.serverStarted = false;
      this.stateLoaded = true;
      await this.hideLoading();
    }

    const error = async (err) => {
      console.log('failed to stop server');
      console.log(err);
      this.stateLoaded = true;
      await this.hideLoading();
    }

    webserver.stop(success, error);
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
    });
  }
}
