import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {



  localeString: string = 'es';
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];

    constructor() {
        
     }

  ngOnInit(): void {
    moment.locale(this.localeString);              
    this.navDate = moment();

    this.makeHeader();
    
  }

  changeNavMonth(num: number){
    if(this.canChangeNavMonth(num)){
      this.navDate.add(num, 'month');
    }
  }

  canChangeNavMonth(num: number){
    const clonedDate = moment(this.navDate);
    clonedDate.add(num, 'month');
    const minDate = moment().add(-1, 'month');
    const maxDate = moment().add(1, 'year');

    return clonedDate.isBetween(minDate, maxDate);
  }

  makeHeader(){
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')));
  }

}
