
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
      // Creiamo un oggetto con 2 Array
      var agenti = {
        nome : [],
        somma : []
      }
      // Facciamo ciclare i risultati della chiamata AJAX
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        // Dichiariamo i nostri salesman 
        var salesman = d.salesman;
        // Condizione che verifica costruisce Array nome
        if (!agenti.nome.includes(salesman)) {
          agenti.nome.push(salesman);
          agenti.somma.push(0);
        }
        // Dichiariamo i nostri profitti
        var profitto = d.amount;
        // Ciclo dell'Array dei nomi
        for (var x = 0; x < agenti.nome.length; x++) {
          // Ogni volta che il salesman corrisponde al nome nell'Array il suo profitto si somma
          if (salesman == agenti.nome[x]) {
            agenti.somma[x] += profitto;
          }
        }
      }
      // Script di Chart per costruire il grafico a torta
      var ctx = document.getElementById('myChartpie').getContext('2d');
      var color = ['red', 'green', 'blue', 'orange'];
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: agenti.nome,
          datasets: [{
            data: agenti.somma,
            borderWidth: 2,
            backgroundColor: color
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

$(document).ready(init);
