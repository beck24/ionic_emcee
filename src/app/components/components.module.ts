import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CountdownComponent } from './countdown/countdown.component';
import { DisplayinfoComponent } from './modals/displayinfo/displayinfo.component';

@NgModule({
  declarations: [
    CountdownComponent,
    DisplayinfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    CountdownComponent
  ],
})
export class ComponentsModule { }
