import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SetupRemotePage } from './setup-remote.page';
import { RemoteinfoComponent } from '../../components/modals/remoteinfo/remoteinfo.component';

const routes: Routes = [
  {
    path: '',
    component: SetupRemotePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SetupRemotePage, RemoteinfoComponent],
  entryComponents: [RemoteinfoComponent]
})
export class SetupRemotePageModule {}
