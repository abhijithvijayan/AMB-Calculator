import "bootstrap";
import "./sass/main.scss";

// Let month = decemenber -> 31 days

function start() {
  var sum = 0,
    amount,
    prev = 0;
  var monthDays = 31;

  eventOne();

  function init() {
    document.querySelector(".amount").value = "";
  }

  function hide(x) {
    document.querySelector(x).style.display = "none";
  }

  function show(x) {
    document.querySelector(x).style.display = "block";
  }

  function reset() {
    amount = 0;
    document.querySelector(".date").value = "";
  }

  function eventOne() {
    hide(".sub-content");
    hide("#final-content-holder");
    hide(".summary");
    init();
    document.querySelector(".submitDays").addEventListener("click", days);
  }

  function amountCalc(i, days) {
    document.querySelector(".submit").addEventListener("click", function() {
      document.querySelector(".text-inner").textContent = i + 1;
      amount = document.querySelector(".amount").value;

      if (amount == "") {
        sum += prev;
        addItem(i, prev);
      } else {
        addItem(i, amount);
        sum += Math.floor(Math.round(amount));
        init();
        prev = Math.floor(Math.round(amount));
      }

      console.log(sum);
      ++i;
      if (i > days) {
        hide(".sub-content");
        calcAvg(sum, days);
      }
    });
  }

  function calcAvg(sum, days) {
    var remDays = monthDays - days;
    var curAvg = Math.round(sum / days);
    var avgMinBal = Math.round((monthDays * 1000 - sum) / remDays);
    final(curAvg, avgMinBal);
  }

  function final(curAvg, avgMinBal) {
    show("#final-content-holder");
    document.querySelector(".avgCurrent").innerHTML = '<strong>' + curAvg + '</strong>';
    document.querySelector(".finalCalc").innerHTML = '<strong>' + avgMinBal + '</strong>';
  }

  function addItem(day, rupee) {
    show(".summary");
    var ul = document.getElementById("dynamic-list");
    var li = document.createElement("li");
    li.setAttribute("id", day);
    li.appendChild(
      document.createTextNode("Day " + day + " | " + "Rupee(s) " + rupee)
    );
    ul.appendChild(li);
  }

  function days() {
    var days = document.querySelector(".date").value;
    Math.floor(days);
    hide(".main-content");
    show(".sub-content");
    console.log("days = " + days);
    amountCalc(1, days);
    reset();
  }

  document.querySelector(".resetDays").addEventListener("click", reset);
  document.querySelector(".reset").addEventListener("click", init);

  // document.querySelector(".new").addEventListener("click", function() {
  //   show('.main-content');
  //   reset();
  //   init();
  //   eventOne();
  // });
}

start();







// CALENDER

// $(function() {
//   function c() {
//     p();
//     var e = h();
//     var r = 0;
//     var u = false;
//     l.empty();
//     while (!u) {
//       if (s[r] == e[0].weekday) {
//         u = true;
//       } else {
//         l.append('<div class="blank"></div>');
//         r++;
//       }
//     }
//     for (var c = 0; c < 42 - r; c++) {
//       if (c >= e.length) {
//         l.append('<div class="blank"></div>');
//       } else {
//         var v = e[c].day;
//         var m = g(new Date(t, n - 1, v)) ? '<div class="today">' : "<div>";
//         l.append(m + "" + v + "</div>");
//       }
//     }
//     var y = o[n - 1];
//     a.css("background-color", y)
//       .find("h1")
//       .text(i[n - 1] + " " + t);
//     f.find("div").css("color", y);
//     l.find(".today").css("background-color", y);
//     d();
//   }
//   function h() {
//     var e = [];
//     for (var r = 1; r < v(t, n) + 1; r++) {
//       e.push({ day: r, weekday: s[m(t, n, r)] });
//     }
//     return e;
//   }
//   function p() {
//     f.empty();
//     for (var e = 0; e < 7; e++) {
//       f.append("<div>" + s[e].substring(0, 3) + "</div>");
//     }
//   }
//   function d() {
//     var t;
//     var n = $("#calendar").css("width", e + "px");
//     n.find((t = "#calendar_weekdays, #calendar_content"))
//       .css("width", e + "px")
//       .find("div")
//       .css({
//         width: e / 7 + "px",
//         height: e / 7 + "px",
//         "line-height": e / 7 + "px"
//       });
//     n.find("#calendar_header")
//       .css({ height: e * (1 / 7) + "px" })
//       .find('i[class^="icon-chevron"]')
//       .css("line-height", e * (1 / 12) + "px");
//   }
//   function v(e, t) {
//     return new Date(e, t, 0).getDate();
//   }
//   function m(e, t, n) {
//     return new Date(e, t - 1, n).getDay();
//   }
//   function g(e) {
//     return y(new Date()) == y(e);
//   }
//   function y(e) {
//     return e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate();
//   }
//   function b() {
//     var e = new Date();
//     t = e.getFullYear();
//     n = e.getMonth() + 1;
//   }
//   var e = 480;
//   var t = 2013;
//   var n = 9;
//   var r = [];
//   var i = [
//     "JANUARY",
//     "FEBRUARY",
//     "MARCH",
//     "APRIL",
//     "MAY",
//     "JUNE",
//     "JULY",
//     "AUGUST",
//     "SEPTEMBER",
//     "OCTOBER",
//     "NOVEMBER",
//     "DECEMBER"
//   ];
//   var s = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday"
//   ];
//   var o = [
//     "#16a085",
//     "#1abc9c",
//     "#c0392b",
//     "#27ae60",
//     "#FF6860",
//     "#f39c12",
//     "#f1c40f",
//     "#e67e22",
//     "#2ecc71",
//     "#e74c3c",
//     "#d35400",
//     "#2c3e50"
//   ];
//   var u = $("#calendar");
//   var a = u.find("#calendar_header");
//   var f = u.find("#calendar_weekdays");
//   var l = u.find("#calendar_content");
//   b();
//   c();
//   a.find('i[class^="icon-chevron"]').on("click", function() {
//     var e = $(this);
//     var r = function(e) {
//       n = e == "next" ? n + 1 : n - 1;
//       if (n < 1) {
//         n = 12;
//         t--;
//       } else if (n > 12) {
//         n = 1;
//         t++;
//       }
//       c();
//     };
//     if (e.attr("class").indexOf("left") != -1) {
//       r("previous");
//     } else {
//       r("next");
//     }
//   });
// });
