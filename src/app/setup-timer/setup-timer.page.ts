import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-setup-timer',
  templateUrl: './setup-timer.page.html',
  styleUrls: ['./setup-timer.page.scss'],
})
export class SetupTimerPage implements OnInit {
  serverStarted: boolean = false;
  loading = null;
  loadingMessage = 'Checking wifi';

  constructor(
    public loadingController: LoadingController
  ) { }

  async ngOnInit() {
    // this.loading = await this.loadingController.create({
    //   message: this.loadingMessage,
    // });

    // this.loading.present();

    // this.startServer();
  }

  startServer() {
    const webserver = window['webserver'];

    if (!webserver) {
      console.log('webserver unavailable');
      return;
    }

    webserver.onRequest(
      (request) => {
        webserver.sendResponse(
          request.requestId,
          {
            status: 200,
            body: '<html>Hello World</html>',
            headers: {
              'Content-Type': 'text/html'
            }
          }
        );
      }
    );

    const s = () => {
      console.log('started');
      this.serverStarted = true;
    };

    const e = (er) => {
      console.log('errored');
      console.log(er);
    };
    
    webserver.start(s, e, 8002);
  }

  stopServer() {
    const webserver = window['webserver'];

    if (!webserver) {
      console.log('webserver unavailable');
      return;
    }

    const success = () => {
      console.log('stopped!');
      this.serverStarted = false;
    }

    const error = (err) => {
      console.log('failed to stop server');
      console.log(err);
    }

    webserver.stop(success, error);
  }
}
