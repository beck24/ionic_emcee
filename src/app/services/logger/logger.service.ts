import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  public logs: Array<any> = [];
  public debug: boolean = false;

  constructor(
    private platform: Platform,
  ) { }

  public log(data) {
    if (!this.debug) {
      return;
    }

    if (!this.platform.is('cordova')) {
      console.log(data);
    }

    this.logs.push({
      time: new Date(),
      data,
    });
  }

  public clear() {
    this.logs = [];
  }

  public enableLogging() {
    this.debug = true;
  }

  public disableLogging() {
    this.debug = false;
    this.clear();
  }
}
