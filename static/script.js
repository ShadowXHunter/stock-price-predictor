const optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn"),
       options = optionMenu.querySelectorAll(".option"),
       sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));       
var selectedOption = ''
options.forEach(option =>{
    option.addEventListener("click", ()=>{
        selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;
        optionMenu.classList.remove("active");
    });
});
 
$(document).ready(function() {
$("#txtDate1").keyup(function (e) {
  if (e.keyCode != 193 && e.keyCode != 111) {
      if (e.keyCode != 8) {
          if ($(this).val().length == 2) {
              $(this).val($(this).val() + "/");
          } else if ($(this).val().length == 5) {
              $(this).val($(this).val() + "/");
          }
      } else {
          var temp = $(this).val();
          if ($(this).val().length == 5) {
              $(this).val(temp.substring(0, 4));
          } else if ($(this).val().length == 2) {
              $(this).val(temp.substring(0, 1));
          }
      }
  } else {
      var temp = $(this).val();
      var tam = $(this).val().length;
      $(this).val(temp.substring(0, tam-1));
  }
});
});
$(document).ready(function() {
  $("#txtDate2").keyup(function (e) {
    if (e.keyCode != 193 && e.keyCode != 111) {
        if (e.keyCode != 8) {
            if ($(this).val().length == 2) {
                $(this).val($(this).val() + "/");
            } else if ($(this).val().length == 5) {
                $(this).val($(this).val() + "/");
            }
        } else {
            var temp = $(this).val();
            if ($(this).val().length == 5) {
                $(this).val(temp.substring(0, 4));
            } else if ($(this).val().length == 2) {
                $(this).val(temp.substring(0, 1));
            }
        }
    } else {
        var temp = $(this).val();
        var tam = $(this).val().length;
        $(this).val(temp.substring(0, tam-1));
    }
  });
  });
var myChart = undefined
$(document).ready(function(){
  $("#fetchbtn").on("click", function(){
    let start_date = document.getElementById("txtDate1").value
    let end_date = document.getElementById("txtDate2").value
    start_date = start_date.split('/').reverse().join('')
    end_date = end_date.split('/').reverse().join('')
    let url = 'http://127.0.0.1:8000/predict/'+selectedOption+'?start='+start_date+'&end='+end_date
    $.ajax({
      type:"GET",
      url: url,
      dataType:"json",

      beforeSend: function(){
        if(myChart!=undefined){
          myChart.destroy()
        }
        $("#chart").hide();
        $("#loader").show();
      },

      complete: function(){
        $("#loader").hide();
        $("#chart").show();
      },

      success: function(data){
        var dates = []
        var predicted = []
        var real = []
        for (let i = 0; i < data['values'].length; i++) {
          dates.push(data['values'][i]['date']);
          predicted.push(data['values'][i]['predicted']);
          real.push(data['values'][i]['real']);
        }

        var ctx = document.getElementById("myChart");
        if(myChart!=undefined)
        myChart.destroy();
        myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [
              { 
                data: predicted,
                label: "Predicted Close",
                borderColor: "#3e95cd",
                fill: false
              },
              { 
                data: real,
                label: "Real Close",
                borderColor: "#c45850",
                fill: false
              }
            ]
          },
          options:{
            scales:{
              xAxes:[{
                scaleLabel:{
                  display:true,
                  labelString:'Date'
                }
              }
              ],
              yAxes:[{
                scaleLabel:{
                  display:true,
                  labelString:'Price (in Rs.)'
                }
              }
              ]
            }
          }
        });
      },

      error: function(){
        console.log("Failed");
      }
    });
  });
});
