import { Injectable } from '@angular/core';
import uuidv4 from 'uuid/v4';
import QRCode from 'qrcode';
import queryString from 'query-string';

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
  listeners = {};
  debug = false;

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
          async (request) => {
            let status: number = 200;
            let body = {};
            let requestToken = '';
            if (request.hasOwnProperty('query')) {
              const query = queryString.parse(request.query);
              requestToken = query.token ? query.token : '';
            }

            if (requestToken !== this.token && !this.debug) {
              status = 403;
              body = { message: 'Unauthorized' };
            } else if (!this.listeners.hasOwnProperty(request.path)) {
              status = 404;
              body = { message: 'Not Found' };
            } else {
              try {
                const result = await this.listeners[request.path](request);

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
                  'Content-Type': 'application/json',
                },
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
}
