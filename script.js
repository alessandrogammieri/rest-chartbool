
function init() {
  // Settiamo la località con Italia
  moment.locale("it");
  // Richiamiamo le funzioni che stmapano i grafici
  printGrafline ()
  printGrafpie ()
  printGrafbar ()
  // Al click si attiva la funzione per postare nuove info
  $("#submit").click(postNewData);
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
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
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
        var profitto = Number(d.amount);
        // Ciclo dell'Array dei nomi
        for (var x = 0; x < agenti.nome.length; x++) {
          // Ogni volta che il salesman corrisponde al nome nell'Array il suo profitto si somma
          if (salesman == agenti.nome[x]) {
            agenti.somma[x] += profitto;
          }
        }
      }
      // Ci calcoliamo la somma di tutti i profitti
      var sum = 0;
      for (i = 0; i < agenti.somma.length; i++) {
        sum += agenti.somma[i];
      }
      // Ci calcoliamo le % dei singoli profitti
      for (i = 0; i < agenti.somma.length; i++) {
        agenti.somma[i] = Math.floor((agenti.somma[i]*100)/sum);
      }
      // Creo il clone del select Venditori
      var source = $("#templateSeller").html();
      var template = Handlebars.compile(source);
      // Ciclo l'Array dei venditori e gli appendo nell'html
      for (y = 0; y < agenti.nome.length; y++) {
        var vend = { 
          val: agenti.nome[y]
        };
        var sellers = template(vend);
        $("#venditore").append(sellers);
      }
      // Script di Chart per costruire il grafico a torta
      var ctx = document.getElementById('myChartpie').getContext('2d');
      var color = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ];
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: agenti.nome,
          datasets: [{
            data: agenti.somma,
            borderWidth: 2,
            backgroundColor: color
          }]
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
  // Creo il clone del select Mesi
  var source = $("#templateMesi").html();
  var template = Handlebars.compile(source);
  // Ciclo l'Array dei venditori e gli appendo nell'html
  for (y = 0; y < mese.length; y++) {
    var mesiAnno = { 
      val: mese[y]
    };
    var month = template(mesiAnno);
    $("#mese").append(month);
  }
  return mese;
}

// Funzione per inserire nuove vendite per mese e venditore
function postNewData () {
  // Estrapolo il venditore o salesman
  var salesman = $("#venditore").val();
  // Estrapolo il valore delle vendite aggiuntive e converto la stringa in numero
  var amount = $("#text-input").val();
  var valore = Number(amount);
  // Estrapolo il valore del mese
  var month = $("#mese").val();
  // Traduco il mese in un oggetto moment.js e mi tiro fuori il primo giorno del mese
  var mom = moment(month, "MMMM");
  // Con moment.js traduco in data un numero random da 1 a 31
  mom.date(Math.floor(Math.random()*(31-1)+1));
  // Con moment.js fisso l'anno al 2017
  mom.year(2017);
  // In una variabile assemblo la mia data nel formato "DD/MM/YYYY"
  var RandomDate = mom.format("DD/MM/YYYY");
  // In una vabile riassumo gli elementi del data
  var outData = {
    salesman: salesman,
    amount: valore,
    date: RandomDate,
  };
  // Chiamata AJAX per aggiungere un elemento
  $.ajax({
    url: "http://157.230.17.132:4009/sales",
    method: "POST",
    data: outData,
    success: function () {
      printGrafline ()
      printGrafpie () 
      printGrafbar ()
    },
    error: function(){
      console.log("C'è stato un errore in upload")
    }
  })
  $("#text-input").val("");
}

// Funzione che ci ritorna i Quarter
function getQuarterProfit (data) {
  // Creo oggetto con i Quarter a cui assegno un valore 0
  var quarter = {
    "1" : 0,
    "2" : 0,
    "3" : 0,
    "4" : 0
  }
  // Ciclo l'array di oggetti restituito dalla chiamata API
  for (var i = 0; i < data.length; i++) {
    // Estrapolo le date di ogni vendita e le trasformo nel formato iso
    var dati = moment(data[i].date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    // Attraverso la funzione quarter ottengo il trimestre a cui appartiene una singola data
    var quad = moment(dati).quarter();
    // Sommo i profitti contrassegnati dallo stesso quarter
    quarter[quad] += Number(data[i].amount);
  }
  // Attribuisco alle chiavi del mio oggetto il valore che corrisponde al Quarter
  var quarterProfit = Object.values(quarter);
  return quarterProfit;
}

// Funzione che ci permette di costruire il grafico Bar
function printGrafbar () {
  $.ajax({
    url: "http://157.230.17.132:4009/sales",
    method: "GET",
    success: function (data) {
      var quarterProfit = getQuarterProfit (data);
      var ctx = document.getElementById('myChartbar').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            label: '# Profitto',
            data: quarterProfit,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
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

$(document).ready(init);
