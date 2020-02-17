import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {



  localeString: string = 'en';
  viewDate: any;

  constructor() { }

  ngOnInit(): void {
    moment.locale(this.localeString);
    this.viewDate = moment();
  }

  changeViewDate(num, datePart){
    if(this.canChange(this.viewDate, num, datePart)){
      this.viewDate.add(num, datePart);
    }
  }

  canChange(dateToCheck, num, datePart){
    const clonedDate = moment(dateToCheck);
    clonedDate.add(num, datePart);
    const minDate = moment().add(-1, 'month');
    const maxDate = moment().add(1, 'year');

    return clonedDate.isBetween(minDate, maxDate);
  }

}
