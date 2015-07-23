_.Module({
required:[
	'splice.controls.calendar.html',
	'splice.controls.calendar.css'
	],	
definition:function(){ 

	
		
	var	DAYS_MONTH = [
		/* non leap year*/ 	 [31,28,31,30,31,30,31,31,30,31,30,31],
		 /* leap year */	 [31,29,31,30,31,30,31,31,30,31,30,31]
		]
					  
	,	MONTHS_NAME = [
			'January', 'February', 'March', 'April', 'May', 'June', 
			'July', 'August', 'September','October', 'November', 'December'
		]			  
			
		
		/* 
		 * number of milliseconds in a day
		 * */
	,	DAY_MILS = (3600 * 24 * 1000)
	;
		
		
	function isLeapYear(year){
			
			/* 
			 * create date object for the March 1st of the required year
			 * */
			var dt = new Date(year,2,1,0,0,0,0);
						
			/* 
			 * previous day
			 * */
			dt.setTime(dt.valueOf() - DAY_MILS);
			
			if(dt.getDate() == 29) return true;
			
			return false;
	};
	
	
	function renderMonth(dt) {
						
		var year 	= dt.getFullYear()
		, 	month 	= dt.getMonth()
		,	day 	= dt.getDate()
		;
		
		var is_leap = isLeapYear(year)?1:0
		, 	days 	= DAYS_MONTH[is_leap][month]
		;

		var start_week_day = new Date(year, month,1,0,0,0,0).getDay();  
				
		
		/* Iterate over days */
		var row = 0
		, 	col = 0
		;
		
		
		var overflow = 7-start_week_day+ 7;
		

		var cde = this.elements.currentDate;
			cde.innerHTML = MONTHS_NAME[month] + ', ' + year;
	
	
		/*
		 * Back track into a previous month
		 * */
		if(start_week_day > 0) {
		
			var _days 	= DAYS_MONTH[is_leap][(month-1)<0?11:(month-1)];
			var _offset = _days - start_week_day+1;  
		
			for(var i=0; i < start_week_day; i++){
				row = Math.floor(i / 7);				
				col = i % 7;
				
				_day = i+_offset;
				
				var cell = getCell.call(this, row+2, col);
				cell.xdateprev = true;  
				
				if(!cell ) return;
				/* 
				 * register bubble mode event handler 
				 * */
				if(!cell.onclick) cell.onclick = function(e){
					if(!e) e = window.event;
					
					CSDialogs.Calendar.decorateCell(this); 
					CSDialogs.Calendar.hide();
				};
				
				cell.onmousedown = function(e){CSDialogs.Calendar.trapEvent(e);};
			
				cell.innerHTML = _day;
				cell.className = 'none';
			}
		}
	
		/*
		 * Render this month and the overflow
		 * */
		for(var i=start_week_day; i < days+start_week_day + overflow; i++){
			row = Math.floor(i / 7);				
			col = i % 7;

			_day = ((i-start_week_day) % days)+1;
			
			var cell = getCell.call(this, row+2, col);
			
			if(!cell) return;
			if(!cell.onclick) cell.onclick = function(e){
				if(!e) e = window.event;
				e.cancelBubble = true;
				if (e.stopPropagation) e.stopPropagation();
				
				CSDialogs.Calendar.decorateCell(this);
				CSDialogs.Calendar.hide();
			};
			
			cell.onmousedown = function(e){CSDialogs.Calendar.trapEvent(e);};
		
			cell.innerHTML = _day;
			/* style this month*/
			if(i < days+start_week_day) {
				cell.className = 'this-month';
				cell.xdatenext = false;
				cell.xdateprev = false;
			} else {
				cell.className = 'none';
				cell.xdatenext = true;  
			}

			if(_day == day && i<days+start_week_day ) cell.className = 'today';
		}
	}; //renderMonth

	function getCell(row, col) {
		try {
		var t = this.elements.grid;
		var r = t.rows[row];
		return r.cells[col]; } catch(e) {return null;}
	};
		
	function next(){
		var m = this.CURRENT_DATE.getMonth();
		var y = this.CURRENT_DATE.getFullYear();
		var d = 1;
		
		m++;
		if(m > 11) { y++; 
			m = 1;
		}
		
		this.CURRENT_DATE = new Date(y,m,d,0,0,0,0);
		
		this.renderMonth(this.CURRENT_DATE);
	};
				
	function prev(){
		var m = this.CURRENT_DATE.getMonth();
		var y = this.CURRENT_DATE.getFullYear();
		var d = 1;
		m--;
		if(m < 0) {
			m = 11;
			y--;
		}
		
		this.CURRENT_DATE = new Date(y,m,d,0,0,0,0);
		this.renderMonth(this.CURRENT_DATE);
	};
		
	function decorateCell(cell){
		var date_value = cell.innerHTML;
		
		if(cell.xdateprev){
			this.prev();
		}
		if(cell.xdatenext){
			this.next();
		}
	};
		
		
		
	function parseDate(strDate){
			var dateParts = strDate.split("/");
			if ( !isNaN(dateParts[2]) && !isNaN(dateParts[1]) && !isNaN(dateParts[0]) ) {
				var date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
				var str_d = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
				return str_d;
			}
			else {
				return null;
			}
	};





	var Calendar = _.Namespace('SpliceJS.Controls').Class(function Calendar(){

		renderMonth.call(this, new Date());

	}).extend(SpliceJS.Core.Controller);




}

});