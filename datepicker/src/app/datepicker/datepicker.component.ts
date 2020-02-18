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
  gridArr: Array<any> = [];
  selectedDate: any;
  range: Array<any> = [];

  constructor() {
      
  }

  ngOnInit(): void {
    moment.locale(this.localeString);              
    this.navDate = moment();
    this.weekDaysHeaderArr = moment.weekdays(true);    
    this.makeGrid();    
  }

  changeNavMonth(num: number){
    if(this.canChangeNavMonth(num)){
      this.navDate.add(num, 'month');
      this.makeGrid();
    }
  }

  canChangeNavMonth(num: number){
    const clonedDate = moment(this.navDate);
    clonedDate.add(num, 'month');
    const minDate = moment().add(-1, 'month');
    const maxDate = moment().add(1, 'year');

    return clonedDate.isBetween(minDate, maxDate);
  }

  makeGrid(){
    this.gridArr = [];

    const firstDayDate = moment(this.navDate).startOf('month');
    const initialEmptyCells = firstDayDate.weekday();
    const lastDayDate = moment(this.navDate).endOf('month');
    const lastEmptyCells = 6 - lastDayDate.weekday();
    const daysInMonth = this.navDate.daysInMonth();
    const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

    /* Calendar & weekends */
    for(let i = 0; i < arrayLength; i++){
      let obj: any = {};
      let day;

      if(i < initialEmptyCells || i > initialEmptyCells + daysInMonth -1){              
        obj.available = false;
        if(i < initialEmptyCells){          
          day = firstDayDate.clone();
          day = day.subtract(6-i, 'days');          
        }else{
          day = lastDayDate.clone();
          day = day.add(1, 'days');          
        }                
        obj.value = day.format('DD');
        obj.date = day;
      } else {
        obj.value = i - initialEmptyCells +1;
        obj.available = this.isAvailable(i - initialEmptyCells +1);
        day = firstDayDate.clone();

        obj.date = day.add( i - initialEmptyCells,'days');

      }      
            
      obj = this.isRange(obj);
      this.gridArr.push(obj);
    }
  }

  isAvailable(num: number): boolean{
        
    let dateToCheck = this.dateFromNum(num, this.navDate);

    //Weekend
    if(dateToCheck.weekday() > 4){
      return false;
    }
    return true;
  }

  isRange(obj){
    
    obj.isRangeStart = false;
    obj.isRangeEnd = false;

    if(this.range[0] && this.range[0].isSame(obj.date, 'day')){
      obj.isRangeStart = true;      
    }

    if(this.range[1] && this.range[1].isSame(obj.date, 'day')){
      obj.isRangeEnd = true;  
    }        
    return obj;
  }

  dateFromNum(num: number, referenceDate: any): any{
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any){
    if(day.available){
      this.selectedDate = this.dateFromNum(day.value, this.navDate);
      
      if(this.range.length > 1){
          
          for(let i = 0; i < this.gridArr.length; i++){
            this.gridArr[i].isRangeStart = false;
            this.gridArr[i].isRangeEnd = false;
          }


          this.range = new Array();
          this.range.push(this.selectedDate);          
      }else{
        this.range.push(this.selectedDate);

        if(this.range.length == 2){          
          if(this.range[0].isAfter(this.selectedDate)){
            this.range.reverse();
          }
        }
      }
      day= this.isRange(day);

      
      
    }
  }
}
