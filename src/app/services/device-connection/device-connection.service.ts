import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import uuidv4 from 'uuid/v4';
import QRCode from 'qrcode';
import queryString from 'query-string';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '../../services/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceConnectionService {
  serverStarted: boolean = false;
  remoteConnected: boolean = false;
  corsHeaders = 'Content-Type, X-Requested-With, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method, Cache-Control, Connection, Host, Origin, Pragma, Referer, User-Agent, X-DevTools-Emulate-Network-Conditions-Client-Id';
  listeners = {};
  qrcode = '';

  thisDevice = {
    ipaddress: '',
    port: 8333,
    token: '',
  };

  otherDevice = {
    ipaddress: '',
    port: 8333,
    token: '',
  };

  debug = true;

  constructor(
    private navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private http: HttpClient,
    private logger: LoggerService,
  ) {
    this.thisDevice.token = uuidv4();

    this.registerListener('/api/handshake', (payload) => {
      return new Promise((resolve, reject) => {
        let result: any = { ...this.thisDevice };
        let status = 200;

        if (payload.ipaddress && payload.port && payload.token) {
          this.otherDevice.ipaddress = payload.ipaddress;
          this.otherDevice.port = payload.port;
          this.otherDevice.token = payload.token;
          this.remoteConnected = true;

          // navigate to waiting page
          this.logger.log('navigate to waiting page');

          this.navCtrl.navigateForward('/timer');
        }
        else {
          status = 500;
          result = { message: "Invalid parameters"};
        }

        resolve({
          status,
          body: result,
        });
      });
    });
  }

  /**
   * Start the server listening for commands
   */
  startServer() {
    return new Promise((resolve, reject) => {
      const webserver = window['webserver'];
      const networkInterface = window['networkinterface'];

      if (!webserver || !networkInterface) {
        reject('Web Server Unavailable');
        return;
      }

      const networkSuccess = (address) => {
        this.thisDevice.ipaddress = address.ip;

        webserver.onRequest(
          async (request) => {
            // Handle options request
            if (request.method === 'OPTIONS') {
              webserver.sendResponse(
                request.requestId,
                {
                  status: 200,
                  body: '',
                  headers: {
                    'Access-Control-Allow-Headers': this.corsHeaders,
                    'Access-Control-Allow-Origin': '*',
                    'Allow': 'GET, POST, OPTIONS',
                    'Content-Type': 'application/json',
                  },
                }
              );

              resolve();
              return;
            }

            // handle actual request
            let status: number = 200;
            let body = {};
            let requestToken = '';
            if (request.hasOwnProperty('query')) {
              const query = queryString.parse(request.query);
              requestToken = query.token ? query.token : '';
            }

            if (requestToken !== this.thisDevice.token && !this.debug) {
              status = 403;
              body = { message: 'Unauthorized' };
            } else if (!this.listeners.hasOwnProperty(request.path)) {
              status = 404;
              body = { message: 'Not Found' };
            } else {
              try {
                this.logger.log('routing request for path');
                this.logger.log(request.path);

                const payload = JSON.parse(request.body);

                const result = await this.listeners[request.path](payload);

                status = result.status;
                body = result.body;
              } catch (e) {
                status = 500;
                body = { error: e.message };
              }
            }

            webserver.sendResponse(
              request.requestId,
              {
                status,
                body,
                headers: {
                  'Access-Control-Allow-Headers': '*',
                  'Access-Control-Allow-Origin': '*',
                  'Allow': 'GET, POST, OPTIONS',
                  'Content-Type': 'application/json',
                },
              }
            );
          }
        );
    
        const s = async () => {
          const payload = {
            ...this.thisDevice,
          };

          this.qrcode = await QRCode.toDataURL(JSON.stringify(payload));
          this.serverStarted = true;

          resolve(payload);
        };
    
        const e = async (er) => {
          this.logger.log("Cannot start server");
          this.logger.log(er);
          reject('Cannot start server');
        };
        
        webserver.start(s, e, this.thisDevice.port);
      };

      const networkError = async (error) => {
        this.logger.log(`Unable to get IP: ${error}`);
        reject('Cannot detect WIFI IP address');
      };

      networkInterface.getWiFiIPAddress(networkSuccess, networkError);
    });
  }

  stopServer() {
    return new Promise((resolve, reject) => {
      const webserver = window['webserver'];

      if (!webserver) {
        reject('Web Server Unavailable')
        return;
      }

      const success = async () => {
        this.qrcode = '';
        this.thisDevice.ipaddress = '';
        this.serverStarted = false;

        resolve();
      }

      const error = async (err) => {
        this.logger.log("Failed to stop server");
        this.logger.log(err);
        reject('Failed to stop server');
      }

      webserver.stop(success, error);
    });
  }

  /**
   * Register a listener function
   * 
   * @param path String - the path to listen to
   * @param callback - a function that returns a promise, resolves a state
   */
  registerListener(path, callback) {
    this.listeners[path] = callback;
  }

  /**
   * 
   * @param path - String - the path to unregister
   */
  unregisterListener(path) {
    if (this.listeners.hasOwnProperty(path)) {
      delete this.listeners[path];
    }
  }

  handshake() {
    return this.callApi('/api/handshake', { ...this.thisDevice } );
  }

  async reset() {
    this.stopServer()
      .catch(() => {})
      .finally(() => {
        // forget other device settings
        this.otherDevice = {
          ipaddress: '',
          port: 8333,
          token: '',
        };

        console.log('navigating back');
        this.navCtrl.navigateBack('/');
      });
  }

  scanSetup() {
    return new Promise(async (resolve, reject) => {
      this.barcodeScanner.scan({ formats: "QR_CODE" })
        .then((data) => {
          const dataJSON = JSON.parse(data.text);

          if (dataJSON.cancelled) {
            reject("Scan was cancelled");
            return;
          }

          if (!dataJSON.ipaddress || !dataJSON.port || !dataJSON.token) {
            reject("Invalid QR Code was scanned");
            return;
          }

          this.otherDevice.ipaddress = dataJSON.ipaddress;
          this.otherDevice.token = dataJSON.token;
          this.otherDevice.port = dataJSON.port;

          this.handshake()
            .then((handshakeData) => {
              if (handshakeData['ipaddress'] === this.otherDevice.ipaddress) {
                this.remoteConnected = true;

                resolve();
                return;
              }

              reject('Invalid scan data');
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  callApi(path, data = {}) {
    return new Promise((resolve, reject) => {
      const url = `http://${this.otherDevice.ipaddress}:${this.otherDevice.port}${path}?token=${this.otherDevice.token}`;
      
      this.http.post(url, data)
      .subscribe((res) => {
        resolve(res);
      },
      (err) => {
        this.logger.log('API Error');
        this.logger.log(err);
        reject(err);
      });
    });
  }
}
