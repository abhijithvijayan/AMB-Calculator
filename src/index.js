import "bootstrap";
import "./sass/main.scss";
import { read } from "fs";

/* ------------------------------ */

// variables

var Ar = [];
var i,
  sum = 0,
  amount,
  current_selected_date,
  total_days,
  varCounter = 0,
  passCount = 0;

// Initializing

var initialize = () => {
  hide("#final-content-holder");
  hide("#acc-summary");
  resetInput();
};

// popping from array
var deleteElement = (val) => {
  for (i = 0; i < Ar.length; ++i) {
    if (val == Ar[i]) {
      // console.log("Deleted:" + Ar[i] + "at:" + varCounter);
      Ar[i] = Ar[varCounter - 1];
      Ar.pop();
      console.log(Ar);
      --varCounter;
    }
  }
};

// main function
var calculation = date => {
  amount = document.querySelector(".amount").value;
  // pass count for no of days selected
  passCount++;
  if (amount < 0) {
    alert("Please enter Amount");
    return;
  } 
  else {
    addItem(date, amount);
    sum += Math.floor(Math.round(amount));
    removeSelectProperty();
  }
  // console.log("sum=" + sum);
};

// creating table
var addItem = (day, rupee) => {
  var ul = document.getElementById("dynamic-list");
  var li = document.createElement("li");
  li.setAttribute("id", day);
  li.setAttribute("class", "deleteNode");
  li.appendChild(
    document.createTextNode("Day " + day + " | " + "Rupee(s) " + rupee)
  );
  ul.appendChild(li);
  show("#acc-summary");
}

// calculating function
var calcAvg = (sum, days, total_days) => {
  var remDays = total_days - days;
  var curAvg = Math.round(sum / days);
  // 1000 is the minimum needed amount
  var avgMinBal = Math.round((total_days * 1000 - sum) / remDays);
  if (avgMinBal <= -1) {
    final(curAvg, 0);
  } 
  else {
    final(curAvg, avgMinBal);
  }
}

// Display Average
function final(curAvg, avgMinBal) {
  show("#final-content-holder");
  document.querySelector(".avgCurrent").innerHTML = "<strong>" + curAvg + "</strong>";
  document.querySelector(".finalCalc").innerHTML = "<strong>" + avgMinBal + "</strong>";
}

// submit button event listener
document.querySelector(".submit-btn").addEventListener("click", () => {
  amount = document.querySelector(".amount").value;
  if (Ar.length == 0) {
    alert("Please Select Date");
  } 
  else if (amount == "") {
    alert("Please Enter Amount");
  } 
  else {
    for (i = 0; i < varCounter; ++i) {
      calculation(Ar[i]);
    }
    // deleting entire array
    Ar.length = 0;
    varCounter = 0;
    resetInput();
  }
});

// calculate button event listener
document.getElementById("calculate").addEventListener("click", () => {
  if (passCount == 0) {
    alert("Select a Date");
  } 
  else {
    calcAvg(sum, passCount, total_days);
    varCounter = 0;
    if (sum == 0) {
      alert("Please enter Amount");
    } 
    else {
      hide("#calendar-wrap");
      hide("#calculate");
      hide(".form-row");
      hide(".header-text");
      hide(".buttons-group");
    }
  }
});

// reset input function
var resetInput = () => {
  document.querySelector(".amount").value = "";
}

// reset function
var reset = () => {
  sum = 0;
  amount = 0;
  passCount = 0;
  resetInput();
  initialize();
  // deleting all nodes using jquery
  $('.deleteNode').remove();
  // making clickable
  $("td").removeClass("noMoreSelection");
}

// reset button
document.querySelector(".reset").addEventListener("click", reset);

// hide elements
var hide = (element) => {
  document.querySelector(element).style.display = "none";
}

// show elements
var show = (element) => {
  document.querySelector(element).style.display = "block";
}

/* ========================================================================== */

// CALENDAR

class Calendar {
  constructor(id) {
    this.displayed_date = new Date(); //date wich calendar displays now
    this.current_day = this.displayed_date.getDate(); //current world time
    this.selected_date = this.displayed_date; //date that user's selected

    this.drawToDom(this.displayed_date, id);

    this.body_node = document.getElementById("calendar-body");
    this.year_node = document.getElementById("calendar-year");
    this.month_node = document.getElementById("calendar-month");

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.setDateTo = this.setDateTo.bind(this);

    this.body_node.addEventListener("click", this.selectHandler);

    document.getElementById("calendar-left-btn").addEventListener("click", this.moveLeft);
    document.getElementById("calendar-right-btn").addEventListener("click", this.moveRight);
  }

  //draws the calendar when the document is loaded
  drawToDom(date, id) {
    let year = date.getFullYear();
    let month = this.getMonthName(date);

    document.getElementById(id).innerHTML = `
			<div id='calendar'>
				<header class="calendar__head">
          <div class="calendar__nav">
          
						<div id='calendar-left-btn' class="calendar__arrow">
              <i class="fas fa-chevron-left"></i>
						</div>

						<div class="calendar__head-text">
							<span id='calendar-month' class="calendar-header-text-month">${month}</span>
							<span id='calendar-year' class="calendar-header-text-year">${year}</span>
						</div>

						<div id='calendar-right-btn' class="calendar__arrow">
              <i class="fas fa-chevron-right"></i>
						</div>
					</div>

					<table class="calendar__head-days">
            <td class='calendar__head-days-item'>S</td>
						<td class='calendar__head-days-item'>M</td>
						<td class='calendar__head-days-item'>T</td>
						<td class='calendar__head-days-item'>W</td>
						<td class='calendar__head-days-item'>T</td>
						<td class='calendar__head-days-item'>F</td>
						<td class='calendar__head-days-item'>S</td>
					</table>
				</header>
				<table id="calendar-body" class='calendar__body'></table>
			</div>`;

    let body = this.createCalendarBody(this.displayed_date, true);

    document.getElementById("calendar-body").appendChild(body);
  }

  createDaysArray(date) {
    let prev_month_last_day = new Date( //number of the last day of the previous month
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();
    let first_week_day = new Date( //number of the first day of the current month f.e. monday->1, wednesday->3
      date.getFullYear(),
      date.getMonth(),
      2
    ).getDay();
    let current_month_last_day = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    let days_array = new Array(42);
    let i = 0; // iterator for all three parts of array

    if (first_week_day == 0) first_week_day = 7; //if it was sunday

    let first_array_element = prev_month_last_day - first_week_day + 2;

    //adds last days of previous month
    for (i = 0; i < first_week_day - 1; ++i) {
      days_array[i] = {
        number: first_array_element + i,
        from: "prev month"
      };
    }

    //adds days of current month
    for (let k = 1; k <= current_month_last_day; ++k) {
      days_array[i] = {
        number: k,
        from: "current month",
        weekend: i % 7 > 4
      };
      i++;
    }

    //adds days of next month
    for (let k = 0; i < days_array.length; ++k) {
      days_array[i] = {
        number: k + 1,
        from: "next month"
      };
      i++;
    }

    // STARTS INITIALIZING
    total_days = current_month_last_day;

    return days_array;
  }

  //returns a  fulfilled and styled table DOM element
  createCalendarBody(date, current_month = false) {
    let days_array = this.createDaysArray(date);
    let table = document.createDocumentFragment();

    let i = 0;

    for (let j = 0; j < 6; ++j) {
      let tr = document.createElement("tr");

      for (let k = 0; k < 7; ++k) {
        let td = document.createElement("td");
        td.innerHTML = days_array[i].number;
        tr.appendChild(td);

        //add the styles that depend on what month the day belongs to
        td.classList.add("calendar-cell");

        if (days_array[i].from !== "current month") {
          td.classList.add("calendar-cell-gray");
        }
        // else {
        //   // adds style to current day
        //   if (current_month && this.selected_date.getDate() == days_array[i].number) {
        //     td.classList.add("calendar-cell-selected");
        //     td.id = "selected_date";
        //   }

        //   // adds style to the current day
        //   // if (current_month && this.current_day == days_array[i].number) {
        //   //   td.classList.add("calendar-cell-today");
        //   // }
        // }
        ++i;
      }
      tr.classList.add("calendar-body-row");
      table.appendChild(tr);
    }

    return table;
  }

  //returns month name from date
  getMonthName(date) {
    const month_names = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    return month_names[date.getMonth()];
  }

  //if the received date corresponds to the current month and year returns true
  isThisMonthCurrent(date) {
    let current = new Date();
    if (
      current.getFullYear() == date.getFullYear() &&
      current.getMonth() == date.getMonth()
    )
      return true;
    else return false;
  }

  //redraws the body according to the received date
  setDateTo(date) {
    let current_month = this.isThisMonthCurrent(date); //if it is current month, current day will ba highlighted
    let new_body = this.createCalendarBody(date, current_month);
    this.year_node.innerHTML = date.getFullYear();
    this.month_node.innerHTML = this.getMonthName(date);
    this.body_node.innerHTML = "";
    this.body_node.appendChild(new_body);
  }

  //redraws the calendar a month in backward
  moveLeft() {
    this.displayed_date = new Date( //set the day to prev month
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth() - 1,
      1
    );

    this.setDateTo(this.displayed_date);

    // reset everything
    reset();
  }

  //redraws the calendar a month in forward
  moveRight() {
    this.displayed_date = new Date( //set the day to next month
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth() + 1,
      1
    );

    this.setDateTo(this.displayed_date);

    // reset everything
    reset();
  }

  // integrated functions
  /* ======================================================= */

  //handles user clicks on cells
  selectHandler(e) {
    if (e.target.classList.contains("calendar-cell-gray")) return; //only days of current month can be selected
    if (!e.target.classList.contains("calendar-cell")) return; //if it wasn't a click on a cell
    if (e.target.classList.contains("noMoreSelection")) return; // can't be selected anymore
    // to be unclicked and deleted from array
    if (e.target.classList.contains("calendar-cell-selected")) {
      e.target.id = "delete";
      removeSelection();
      deleteElement(e.target.innerHTML);
      return;
    }

    this.selected_date = new Date(
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth(),
      e.target.innerHTML
    );

    // selected date
    current_selected_date = this.selected_date.getDate();

    // push to array
    readArray(current_selected_date);

    e.target.id = "selected_date";
    e.target.classList.add("calendar-cell-selected");
  }
}

// push to array fn
var readArray = (value) => {
  Ar.push(value);
  ++varCounter;
  // console.log("Inserted:" + value + "at" + varCounter);
};

// remove the selected and make it non selectable
var removeSelectProperty = () => {
  let prev_selected = document.getElementById("selected_date");
  if (prev_selected) {
    prev_selected.classList.remove("calendar-cell-selected");
    prev_selected.id = "";
    prev_selected.classList.add("noMoreSelection");
  }
};

// remove the selected
var removeSelection = () => {
  let prev_selected = document.getElementById("delete");
  prev_selected.classList.remove("calendar-cell-selected");
  prev_selected.id = "";
};

// =========================================== //

const calendar = new Calendar("calendar-wrap");

// initialize the app
initialize();