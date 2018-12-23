import { Injectable } from '@angular/core';
import uuidv4 from 'uuid/v4';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class DeviceConnectionService {
  ipaddress = '';
  remoteaddress = '';
  port = 8333;
  remoteport = null;
  token = '';
  remotetoken = '';
  serverStarted: boolean = false;
  remoteConnected: boolean = false;
  qrcode = '';

  constructor() {
    this.token = uuidv4();
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
        this.ipaddress = address.ip;

        webserver.onRequest(
          (request) => {
            webserver.sendResponse(
              request.requestId,
              {
                status: 200,
                body: {'test': 'result'}, // '<html>Hello World new!</html>',
                headers: {
                  'Content-Type': 'application/json', // 'Content-Type': 'text/html'
                }
              }
            );
          }
        );
    
        const s = async () => {
          const payload = {
            address: this.ipaddress,
            port: this.port,
            token: this.token,
          };

          this.qrcode = await QRCode.toDataURL(JSON.stringify(payload));
          this.serverStarted = true;

          resolve({
            ...payload,
            qrcode: this.qrcode,
          });
        };
    
        const e = async (er) => {
          console.log(er);
          reject('Cannot start server');
        };
        
        webserver.start(s, e, this.port);
      };

      const networkError = async (error) => {
        console.error(`Unable to get IP: ${error}`);
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
        this.ipaddress = '';
        this.serverStarted = false;

        resolve();
      }

      const error = async (err) => {
        console.log(err);
        reject('Failed to stop server');
      }

      webserver.stop(success, error);
    });
  }
}
