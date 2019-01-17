import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CountdownComponent } from './countdown/countdown.component';

@NgModule({
  declarations: [
    CountdownComponent,
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
