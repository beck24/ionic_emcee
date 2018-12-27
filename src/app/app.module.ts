import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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

@NgModule({
  declarations: [AppComponent, DebuggerComponent],
  entryComponents: [DebuggerComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DeviceConnectionService,
    BarcodeScanner,
    LoggerService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
