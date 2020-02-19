import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})

export class DatepickerComponent implements OnInit {

  /* GLOBAL */
  localeString: string = 'es';
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: Array<any> = [];
  selectedDate: any;
  range: Array<any> = [];

  /* CONFIG */
  conf = {
    'localeString': 'es',
    'showItems': 1,
    'showSlides': false
  };

  constructor() {
      
  }

  ngOnInit(): void {  
    moment.locale(this.conf.localeString);                  
    this.navDate = moment();
    this.weekDaysHeaderArr = moment.weekdays(true);    
    this.makeGrid();    
  }

  selectToday(){
    this.navDate = moment();
    this.makeGrid();
  }

  changeNavMonth(num: number){    
    if(this.canChangeNavMonth(num)){
      this.navDate.add(num, 'month');
      this.makeGrid();
    }
  }

  clearDays(){
    this.range = new Array();
    this.makeGrid();
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
    

    for(let j = 0; j< this.conf.showItems; j++){
      let auxDate = moment(this.navDate);
      auxDate.add(j, 'months');
      

      let firstDayDate = moment(auxDate).startOf('month');
      let initialEmptyCells = firstDayDate.weekday();
      let lastDayDate = moment(auxDate).endOf('month');
      let lastEmptyCells = 6 - lastDayDate.weekday();
      let daysInMonth = auxDate.daysInMonth();
      let arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;
      

      this.gridArr[j] = [];
      this.gridArr[j]['days'] = [];

      /* Calendar & weekends */
      for(let i = 0; i < arrayLength; i++){
        let obj: any = {};
        let day;

        if(i < initialEmptyCells || i > initialEmptyCells + daysInMonth -1){              
          obj.available = false;
          if(i < initialEmptyCells){          
            day = firstDayDate.clone();            
            day = day.subtract(initialEmptyCells-i, 'days');                  
            
          }else{
            var aux = i - (initialEmptyCells + daysInMonth -1);
            day = lastDayDate.clone();
            day = day.add(aux, 'days');          
            
          } 
          
          obj.value = day.format('DD');
          obj.date = day;
          
        } else {
          obj.value = i - initialEmptyCells +1;                    
          day = firstDayDate.clone();
          obj.date = day.add( i - initialEmptyCells,'days');
          obj.available = this.isAvailable(obj.date);
        }      
                      
        this.gridArr[j]['date'] = auxDate;
        this.gridArr[j]['days'].push(obj);
      }
    }     
  }

  isAvailable(dateToCheck): boolean{
        
    //Weekend
    if(dateToCheck.weekday() > 4){
      return false;
    }
    return true;
  }

  updateRange(){    
    for(let i= 0; i< this.gridArr.length;  i++){       

      for(let j= 0; j< this.gridArr[i].days.length; j++){

        let obj = this.gridArr[i].days[j];
        obj.isRangeStart = false;
        obj.isRangeEnd = false;
        obj.isRange = false;

        if(this.range[0] && this.range[0].isSame(obj.date, 'day')){
          obj.isRangeStart = true;      
        }
    
        if(this.range[1] && this.range[1].isSame(obj.date, 'day')){
          obj.isRangeEnd = true;  
        }  

        if(this.range[0] && this.range[1]){
          if(obj.date.isBetween(this.range[0], this.range[1], 'days')){
            obj.isRange = true;
          }
          
        }
      }
    }
  }

  isRange(obj){    
    obj.isRangeStart = false;
    obj.isRangeEnd = false;
    obj.isRange = false;
    
   
    if(this.range.length > 1){
      this.range = new Array();
      this.range.push(obj.date);  
      
    }else{
      this.range.push(obj.date);

      if(this.range.length == 2){          
        if(this.range[0].isAfter(obj.date)){
          this.range.reverse();
        }
      }
    }




    /*




    for(let i = 0; i < this.gridArr.length; i++){
      for(let j= 0; j< this.gridArr[i].length; j++){
          console.log('aqui', this.gridArr[i][j]);
      }
    }


    /*    
    

      

    for(let i = 0; i < this.gridArr.length; i++){

      for(let j= 0; j< this.gridArr[i]; j++){
        this.gridArr[i][j].isRange = false;     

        if(this.range[1] && this.gridArr[i][j].date.isBetween(this.range[0], this.range[1])){
          this.gridArr[i][j].isRange = true;        
        }
      }
      
    }*/
  }

  dateFromNum(num: number, referenceDate: any): any{
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any){
    if(day.available){                   
      this.isRange(day);
      this.updateRange();
    }
  }
}
