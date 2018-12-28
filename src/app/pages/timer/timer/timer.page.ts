import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('on init');
  }

  ngOnDestroy() {
    console.log('on destroy');
  }
}
