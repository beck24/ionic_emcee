import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/setup/setup.module#SetupPageModule' },
  { path: 'setup-timer', loadChildren: './pages/setup-timer/setup-timer.module#SetupTimerPageModule' },
  { path: 'setup-remote', loadChildren: './pages/setup-remote/setup-remote.module#SetupRemotePageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
