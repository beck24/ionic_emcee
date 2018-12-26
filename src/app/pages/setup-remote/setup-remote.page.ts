import { Component, OnInit } from '@angular/core';
import { DeviceConnectionService } from '../../services/device-connection/device-connection.service';

@Component({
  selector: 'app-setup-remote',
  templateUrl: './setup-remote.page.html',
  styleUrls: ['./setup-remote.page.scss'],
})
export class SetupRemotePage implements OnInit {
  stateLoaded: boolean = true;
  errors: Array<String> = [];

  constructor(
    private deviceConnectionService: DeviceConnectionService,
  ) { }

  ngOnInit() {
  }

  scan() {
    this.deviceConnectionService.scanSetup()
      .then(() => {
        console.log('success');
      })
      .catch((error) => {
        console.log('scan error', error);
        this.errors.push(error);
      });
  }
}
