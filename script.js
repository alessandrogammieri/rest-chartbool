
function init() {
  // Settiamo la località con Italia
  moment.locale("it");

  printGrafline ()
  printGrafpie ()
}

// Funzione che ci restituisce i profitti del mese
function getProfit (data) {
  // Creiamo un Array di 12 elementi con ognuno valore 0
  var monthProfit = new Array(12).fill(0);
  // Facciamo ciclare i risultati della chiamata AJAX
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var date = d.date;
    // Convertiamo l'oggetto in un numero
    var amount = Number(d.amount);
    var month = moment(date, "DD/MM/YYYY").month();
    // Sommiamo i profitti di ogni mese
    monthProfit[month] += amount;
  }
  return monthProfit
}

// Funzione che ci permette di costruire il grafico Line
function printGrafline () {
  $.ajax({
    url: "http://157.230.17.132:4009/sales",
    method: "GET",
    success: function (data) {
      var monthProfit = getProfit (data);
      var getMonths = getMonth ();

      var ctx = document.getElementById('myChartline').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: getMonths,
          datasets: [{
            label: '# Profitto',
            data: monthProfit,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    },
    error: function () {
      alert("C'è stato un errore in download");
    }
  })
}

// Funzione che ci permette di costruire il grafico a Torta
function printGrafpie () {
  $.ajax({
    url: "http://157.230.17.132:4009/sales",
    method: "GET",
    success: function (data) {
      // var monthProfit = getProfit (data);
      var getUsers = getUser (data);

      var ctx = document.getElementById('myChartpie').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            'Marco',
            'Giuseppe',
            'Riccardo',
            'Roberto'
          ],
          datasets: [{
            label: '# 2017',
            data: getUsers,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    },
    error: function () {
        alert("C'è stato un errore in download");
    }
  })
}

// Funzione che ci ritorna la lista dei mesi in inglese
function getMonth () {
  var mese = moment.months();
  return mese;
}

// Funzione che ci ritorna i profitti per salesman
function getUser (data) {
  // Creiamo un Array di 4 elementi
  var user = [];
  console.log(user);
  var profit = [];
  console.log(profit);

  // Facciamo ciclare i risultati della chiamata AJAX
  for (var i = 0; i < data.length; i++) {
    var d = data[i];

    // Prendiamo i nostri salesman e li pushamo
    var salesman = d.salesman;
    user.push(salesman);

    // Prendiamo i nostri profitti e li pushamo
    var amount = Number(d.amount);
    profit.push(amount);
  }
}

$(document).ready(init);
