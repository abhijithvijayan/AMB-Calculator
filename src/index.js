import "bootstrap";
import "./sass/main.scss";

// Let month = decemenber -> 31 days

start();

function start() {
  // declarations
  var sum = 0,
    amount,
    prev = 0;
  var monthDays = 31;

  init();

  // Initializing
  function init() {
    // hide all
    hide(".sub-content");
    hide("#final-content-holder");
    hide("#acc-summary");

    resetInput();
    // Read days function
    document.querySelector(".submitDays").addEventListener("click", () => {
      var days = document.querySelector(".date").value;
      // validator
      if (days != "") {
        Math.floor(days);
        hide(".main-content");
        show(".sub-content");
        console.log("days = " + days);
        amountCalc(1, days);
        reset();
      }
    });
  }

  // Looping Function
  function amountCalc(i, days) {
    document.querySelector(".submit-btn").addEventListener("click", () => {
      document.querySelector(".text-inner").textContent = i + 1;
      // read the amount
      amount = document.querySelector(".amount").value;

      if (amount == "") {
        // same amount as previous day
        sum += prev;
        addItem(i, prev);
      } else {
        addItem(i, amount);
        sum += Math.floor(Math.round(amount));
        resetInput();
        prev = Math.floor(Math.round(amount));
      }

      // console.log(sum);
      ++i;
      if (i > days) {
        hide(".sub-content");
        calcAvg(sum, days);
      }
    });
  }

  // Display List
  function addItem(day, rupee) {
    // show(".summary");
    var ul = document.getElementById("dynamic-list");
    var li = document.createElement("li");
    li.setAttribute("id", day);
    li.appendChild(
      document.createTextNode("Day " + day + " | " + "Rupee(s) " + rupee)
    );
    ul.appendChild(li);
    show("#acc-summary");
  }

  // Average Calculator
  function calcAvg(sum, days) {
    var remDays = monthDays - days;
    var curAvg = Math.round(sum / days);
    // 1000 is the minimum needed amount
    var avgMinBal = Math.round((monthDays * 1000 - sum) / remDays);

    if (avgMinBal <= -1) {
      final(curAvg, 0);
    } else {
      final(curAvg, avgMinBal);
    }
  }

  // Display Average
  function final(curAvg, avgMinBal) {
    show("#final-content-holder");
    document.querySelector(".avgCurrent").innerHTML =
      "<strong>" + curAvg + "</strong>";
    document.querySelector(".finalCalc").innerHTML =
      "<strong>" + avgMinBal + "</strong>";
  }

  document.querySelector(".resetDays").addEventListener("click", reset);
  document.querySelector(".reset").addEventListener("click", resetInput);

  function resetInput() {
    document.querySelector(".amount").value = "";
  }
  function reset() {
    amount = 0;
    document.querySelector(".date").value = "";
  }
  function hide(element) {
    document.querySelector(element).style.display = "none";
  }
  function show(element) {
    document.querySelector(element).style.display = "block";
  }
}

/* ================================================================= */

// CALENDER

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

    document
      .getElementById("calendar-left-btn") //adds listeners for buttons
      .addEventListener("click", this.moveLeft);
    document
      .getElementById("calendar-right-btn")
      .addEventListener("click", this.moveRight);
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
							<span id='calendar-month' class="calender-header-text-month">${month}</span>
							<span id='calendar-year' class="calender-header-text-year">${year}</span>
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
      date.getMonth(), 2
    ).getDay();
    let current_month_last_day = new Date(
      date.getFullYear(),
      date.getMonth() + 1, 0
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
  }

  //redraws the calendar a month in forward
  moveRight() {
    this.displayed_date = new Date( //set the day to next month
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth() + 1,
      1
    );

    this.setDateTo(this.displayed_date);
  }

  //handles user clicks on cells
  selectHandler(e) {
    if (e.target.classList.contains("calendar-cell-gray")) return; //only days of current month can be selected
    if (!e.target.classList.contains("calendar-cell")) return; //if it wawn't a click on a cell

    let prev_selected = document.getElementById("selected_date");
    if (prev_selected) {
      prev_selected.classList.remove("calendar-cell-selected");
      prev_selected.id = "";
    }

    this.selected_date = new Date(
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth(),
      e.target.innerHTML
    );

    e.target.id = "selected_date";
    e.target.classList.add("calendar-cell-selected");
  }
}

const calendar = new Calendar("calendar-wrap");
