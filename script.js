
function init() {
  // Settiamo la località con Italia
  moment.locale("it");

  printGrafline ()
  printGrafpie ()

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
  // Dichiariamo le variabili con i valori scelti dall'utente
  var salesman = $("#venditore").val();

  var amount = $("#text-input").val();
  var valore = Number(amount);

  var month = $("#mese").val();
  var mom = moment(month, "MMMM");
  mom.date(Math.floor(Math.random()*(31-1)+1));
  
  mom.year(2017);
  var RandomDate = mom.format("DD/MM/YYYY");

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
    },
    error: function(){
      console.log("C'è stato un errore in upload")
    }
  })
  $("#text-input").val("");
}

$(document).ready(init);
