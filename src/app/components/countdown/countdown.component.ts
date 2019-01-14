import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as addMilliseconds from 'date-fns/add_milliseconds';
import * as differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import * as differenceInSeconds from 'date-fns/difference_in_seconds';
import * as differenceInMinutes from 'date-fns/difference_in_minutes';
import * as differenceInHours from 'date-fns/difference_in_hours';

@Component({
  selector: 'countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  startTime: any;
  endTime: any;
  timeDiff: number = 0;
  timerDisplay: string = '00:00:00';
  timerActive: boolean = false;
  count: number = 0;
  interval: any = null;
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Input() control: string;
  @Input() time: any = 0; // numnber of ms to count down from

  constructor() { }

  ngOnInit() {
    this.time = parseFloat(this.time);

    // Note - interval ticker necessary to keep the renderer engaged
    // otherwise the component stops listening to changes on Input for some reason
    // it's hacky but it works
    this.interval = setInterval(() => {
      this.count++;

      if (this.count >= 1000) {
        this.count = 0;
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

    if (changes.hasOwnProperty('control')) {
      switch (changes.control.currentValue) {
        case 'start':
          this.startTimer();
        break;
        case 'stop':
          this.stopTimer();
        break;
        case 'reset':
          this.reset();
        break;
      }
    }

    if (changes.hasOwnProperty('time')) {
      this.time = parseFloat(changes.time.currentValue);
      this.reset();
    }
  }

  ngOnDestroy() {
    if (this.interval !== null) {
      clearInterval(this.interval);
    }
  }

  startTimer() {
    this.startTime = new Date();
    this.timerActive = true;
    this.tick();
  }

  stopTimer() {
    this.timerActive = false;
    this.timeDiff -= differenceInMilliseconds(new Date(), this.startTime); // moment().diff(this.startTime);
    this.result.emit(this.timeDiff);
  }

  reset() {
    this.stopTimer;
    this.time = parseFloat(this.time);
    this.timeDiff = this.time;
    this.timerDisplay = this.getMSAsDigitalClock(this.timeDiff);
  }

  tick() {
    setTimeout(() => {
      if (!this.timerActive) {
        return;
      }

      this.endTime = new Date();

      let ms = this.timeDiff - differenceInMilliseconds(new Date(), this.startTime); // moment().diff(this.startTime, 'milliseconds');

      if (ms <= 0) {
        this.timeDiff = 0;
        this.timerActive = false;
        this.result.emit(true);
        return;
      }

      this.timerDisplay = this.getMSAsDigitalClock(ms);

      this.tick();
    }, 100);
  }

  getMSAsDigitalClock(milliseconds: number) {
    const now = new Date();
    const then = addMilliseconds(now, milliseconds);

    const thenOriginal = addMilliseconds(now, this.time);

    const hOrig = differenceInHours(thenOriginal, now);
    const mOrig = differenceInMinutes(thenOriginal, now);

    const h = differenceInHours(then, now);
    const m = differenceInMinutes(then, now) % 60;
    const s = differenceInSeconds(then, now) % 60;

    let hourString = h < 10 ? `0${h}:` : `${h}:`;
    let minuteString = m < 10 ? `0${m}:` : `${m}:`;
    let secondString = s < 10 ? `0${s}` : `${s}`;

    if (!hOrig) {
      hourString = '';

      if (!mOrig) {
        minuteString = '';
      }
    }

    return `${hourString}${minuteString}${secondString}`;
  }
}
