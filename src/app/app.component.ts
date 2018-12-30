import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
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
    private screenOrientation: ScreenOrientation,
    private logger: LoggerService,
    private modalController: ModalController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.logger.enableLogging();

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  debugDown() {
    if (this.debuggerActive) {
      return;
    }

    this.debugTapCount++;
    
    if (this.debugTapCount === 5) {
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
      backdropDismiss: false,
    });

    modal.onDidDismiss().then(() => {
      this.debuggerActive = false;
    });

    return await modal.present().then(() => {
      this.debuggerActive = true;
    });
  }
}
