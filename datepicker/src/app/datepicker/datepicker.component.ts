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
  selectedDates : Array<any> = [];
  selectedSingleDates : Array<any> = [];
  selectedRangeDates : Array<any> = [];
  range: Array<any> = [];
  currentRangeIndex: num = 0;
  _petitionType: any;

  get petitionType() {
    return this._petitionType;
  }

  set petitionType(value:string){    
    this._petitionType = value;
  }

  /* CONFIG */
  conf = {
    'localeString': 'es',
    'showItems': 3 ,
    'showSlides': false
  };

  constructor() {
      
  }

  ngOnInit(): void {  
    this.petitionType = 'range';    
    this.range[this.currentRangeIndex] = new Array();
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
    this.currentRangeIndex = 0;
    this.selectedDates = new Array();
    this.selectedSingleDates = new Array();
    this.selectedRangeDates = new Array();
    
    this.selectedDate = null;
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

    this.updateRange();
  }

  isAvailable(dateToCheck): boolean{
        
    //Weekend
    if(dateToCheck.weekday() > 4){
      return false;
    }
    return true;
  }

  updateRange(){    
    
    this.selectedRangeDates = new Array();

    for(let i= 0; i< this.gridArr.length;  i++){       

      for(let j= 0; j< this.gridArr[i].days.length; j++){

        let obj = this.gridArr[i].days[j];
        obj.isRangeStart = false;
        obj.isRangeEnd = false;
        obj.isRange = false;     
        obj.rangeIndex = -1;   


        for(let k=0; k< this.range.length; k++){
          if(this.range[k][0] && this.range[k][0].isSame(obj.date, 'day')){
            obj.isRangeStart = true;      
            this.setSelectedDates(obj.date, this.selectedRangeDates);
            obj.rangeIndex = k;
          }

          if(this.range[k][1] && this.range[k][1].isSame(obj.date, 'day')){
            obj.isRangeEnd = true;  
            this.setSelectedDates(obj.date, this.selectedRangeDates);
            obj.rangeIndex = k;
          }

          if(this.range[k][0] && this.range[k][1]){
            if(obj.date.isBetween(this.range[k][0], this.range[k][1], 'days', '()')){
              obj.isRange = true;
              obj.rangeIndex = k;
  
              if(obj.available){
                this.setSelectedDates(obj.date, this.selectedRangeDates);      
              }
  
              if(obj.isSingle){
                obj.isSingle = false;
                this.unsetSelectedDates(obj.date, this.selectedSingleDates);
              }
            }          
          }
        }

      }
    }    
  }

  setSelectedDates(date, data){
    if (data.includes(date) === false) data.push(date); 
  }

  unsetSelectedDates(date, data){ 
    for(let i = 0; i< data.length; i++){
      if(date.isSame(data[i],'day')){
        data.splice(i, 1); 
      }
    }     
  }

  isRange(obj){    
    obj.isRangeStart = false;
    obj.isRangeEnd = false;
    obj.isRange = false;    
   
    if(this.range[this.currentRangeIndex].length > 1){
      this.range[this.currentRangeIndex] = new Array();
      this.range[this.currentRangeIndex].push(obj.date);        
    }else{
      this.range[this.currentRangeIndex].push(obj.date);     
            
      if(this.range[this.currentRangeIndex].length == 2){          
        if(this.range[this.currentRangeIndex][0].isAfter(obj.date)){
          this.range[this.currentRangeIndex].reverse();          
        }
        this.checkRanges();
      }
    }
  }

  checkRanges(){    
    
    const startDate = this.range[this.currentRangeIndex][0];
    const endDate = this.range[this.currentRangeIndex][1];
    let delIndex = -1;


    

    for(let i= 0; i<this.currentRangeIndex; i++){
      let startDateOld = this.range[i][0];
      let endDateOld = this.range[i][1]?this.range[i][1]:undefined;   


      if(startDateOld.isBetween(startDate, endDate, 'days', '[]')){
        if(endDateOld){          
            if(endDateOld.isBetween(startDate, endDate, 'days', '[]')){
              delIndex = i;          
            }else{              
              delIndex = i;
              this.range[this.currentRangeIndex][1] = endDateOld;
            }
        }else{
          delIndex = i;          
        }
      }

      if(startDate.isBetween(startDateOld, endDateOld, 'days', '[]')){

        if(endDate.isSameOrAfter(endDateOld, 'days')){
          delIndex = i;
          this.range[this.currentRangeIndex][0] = startDateOld;
        }
        
      }

      
    }

    if(delIndex !== -1){
      this.range.splice(delIndex, 1); 
      this.currentRangeIndex--;
    }

  }

  dateFromNum(num: number, referenceDate: any): any{
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any){
    if(day.available){   
      this.selectedDate = day.date;       
      
      if(this.petitionType == 'range'){
        this.isRange(day);
        this.updateRange();
      }
      else{
        if(!(day.isRange || day.isRangeEnd || day.isRangeStart  )){
          day.isSingle = !day.isSingle;

          if(day.isSingle){
            this.setSelectedDates(day.date, this.selectedSingleDates);            
          }else{
            this.unsetSelectedDates(day.date, this.selectedSingleDates);
          }
        }
          
      }
      
    }
  }

  petitionTypeToggle(){
    if(this.petitionType == 'single')
      {
        this.petitionType = 'range';
      }
      else{
        this.petitionType = 'single';

        if(this.getCurrentRangeLength()){
          this.addNewRange();
        }
      }    
  }

  getCurrentRangeLength(){
    return this.range[this.currentRangeIndex].length;
  }

  addNewRange(){
    let newRange = new Array();
    this.range.push(newRange);    
    this.currentRangeIndex++;
  }

  isChecked(){
    return this.petitionType === 'range';
  }

}
