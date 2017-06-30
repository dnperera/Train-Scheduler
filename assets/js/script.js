
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDCHzsyPS4bsXcEFet37rg_6Tby3YAtHIY",
    authDomain: "train-scheduler-706e2.firebaseapp.com",
    databaseURL: "https://train-scheduler-706e2.firebaseio.com",
    projectId: "train-scheduler-706e2",
    storageBucket: "",
    messagingSenderId: "897062544164"
  };

  firebase.initializeApp(config);

  // Assign the reference to the database to a variable named 'database'
  var database = firebase.database();
  
$(document).ready(function(){

      //Retrieve and child display all child data
      database.ref().on('child_added', function(snapshot) {

        // console.log(snapshot.child("trainName").val());
        // console.log(snapshot.child("destination").val());
        // console.log(snapshot.child("firstTrainTime").val());
        // console.log(snapshot.child("frequncy").val());

        //call display function
        displayInfo(snapshot.child("trainName").val(),
          snapshot.child("destination").val(),
          snapshot.child("firstTrainTime").val(),
          snapshot.child("frequncy").val());


      });

      function calculateTimeDifference(firstTrain,freq){
          var results ={};
          // First Time (pushed back 1 week to make sure it comes before current time)
          //var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "weeks");
          
          var firstTimeConverted = moment(firstTrain, "hh:mm");
          console.log(firstTimeConverted);

          // Current Time
          var currentTime = moment();
          console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

          // Difference between the times
          var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
          console.log("DIFFERENCE IN TIME: " + diffTime);
          
          var tRemainder ;
          var tMinutesTillTrain;
          var nextTrain;

          // if the first train not yet left
          if(diffTime < 0){

              //firstTimeConverted = moment(firstTrain, "hh:mm");
              
              diffTime = moment(firstTimeConverted).diff(moment(), "minutes");
              console.log("Recalculated  DIFFERENCE IN TIME: " + diffTime);

              // Minute Until Train
              tMinutesTillTrain = diffTime;
              console.log("Early Train MINUTES TILL TRAIN: " + tMinutesTillTrain);

              // Next Train
               nextTrain = firstTimeConverted;
               console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

            }   
          else{

              // Time apart (remainder)
              tRemainder = diffTime % freq;
               console.log(tRemainder);

               // Minute Until Train
               tMinutesTillTrain = freq - tRemainder;
               console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

               // Next Train
               nextTrain = moment().add(tMinutesTillTrain, "minutes");
               console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

           }   

          return results ={
              minutesAway:tMinutesTillTrain,
              nextArrival:moment(nextTrain).format("hh:mm A")
          };

      }

      //console.log(calculateTimeDifference("09:30",15));

      function reset() {

        $("#trainname").val("");
        $("#destination").val("");
        $("#firsttraintime").val("");
        $("#frequncy").val("");

      }

      //Display info on the browser
      function displayInfo(trainName,destination,firstTrain,freq){
        var timetoTrain = calculateTimeDifference(firstTrain,freq);
        var row = $("<tr>");
          row.append($("<td>").text(trainName));
          row.append($("<td>").text(destination));
          row.append($("<td>").text(freq));
          row.append($("<td>").text(timetoTrain.nextArrival));
          row.append($("<td>").text(timetoTrain.minutesAway));
     
          $("#train-records").prepend(row);

      }

      // Whenever a user clicks the submit button
      $("#submit-record").on("click", function(event) {
        
          // Prevent form from submitting
          event.preventDefault();


          var trainName = $("#trainname").val().trim();
          var destination = $("#destination").val().trim();
          var firstTrainTime = $("#firsttraintime").val().trim();
          var frequncy= $("#frequncy").val().trim();

          console.log(trainName +"--"+destination+"--"+firstTrainTime+"--"+frequncy);


          // Save the new record in Firebase
            database.ref().push({
              trainName:trainName,
              destination:destination,
              firstTrainTime:firstTrainTime,
              frequncy:frequncy
            });

          //call display function
          //displayInfo(trainName,destination,firstTrainTime,frequncy);
          reset();

      });

}); //End document ready