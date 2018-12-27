import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoggerService } from './services/logger/logger.service';
import { DebuggerComponent } from './components/modals/debugger/debugger.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  debugTapCount = 0;
  debuggerActive: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private logger: LoggerService,
    private modalController: ModalController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.logger.enableLogging();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  debugTap() {
    this.debugTapCount++;
    
    if (this.debugTapCount === 5) {
      console.log('debug enabled');
      this.debugTapCount = 0;
      this.launchDebugger();
    }
    else {
      setTimeout(() => {
        this.debugTapCount = 0;
      }, 4000);
    }
  }

  async launchDebugger() {
    if (this.debuggerActive) {
      return;
    }

    const modal = await this.modalController.create({
      component: DebuggerComponent,
    });

    modal.onDidDismiss().then(() => {
      this.logger.log('Logger dismissed');
      this.debuggerActive = false;
    });

    return await modal.present().then(() => {
      this.logger.log('Logger opened');
    });
  }
}
