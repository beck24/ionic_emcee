import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClientModule } from '@angular/common/http';

import { DeviceConnectionService } from './services/device-connection/device-connection.service';
import { LoggerService } from './services/logger/logger.service';
import { DebuggerComponent } from './components/modals/debugger/debugger.component';
import { FormsModule } from '@angular/forms';

// https://medium.com/madewithply/ionic-4-long-press-gestures-96cf1e44098b
import { IonicGestureConfig } from "./gestures/ionic-gesture-config";

@NgModule({
  declarations: [AppComponent, DebuggerComponent],
  entryComponents: [DebuggerComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DeviceConnectionService,
    BarcodeScanner,
    LoggerService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
