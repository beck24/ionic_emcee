import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SetupTimerPage } from './setup-timer.page';
import { DisplayinfoComponent } from '../../components/modals/displayinfo/displayinfo.component';

const routes: Routes = [
  {
    path: '',
    component: SetupTimerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SetupTimerPage, DisplayinfoComponent],
  entryComponents: [DisplayinfoComponent]
})
export class SetupTimerPageModule {}
