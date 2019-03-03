var config = {
    apiKey: "AIzaSyC7rFSTUt4D1dJJvqX1G66vawwDae_Dnco",
    authDomain: "train-timetable-9cbb3.firebaseapp.com",
    databaseURL: "https://train-timetable-9cbb3.firebaseio.com",
    projectId: "train-timetable-9cbb3",
    storageBucket: "",
    messagingSenderId: "375774089757"
  };
firebase.initializeApp(config);

var database = firebase.database();
var name = "";
var destination = "";
var firstTrain = "00:00";
var frequency = 1;

$("#submit-button").on("click", function(event) {
    event.preventDefault();

    name = $("#name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#start-time").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    })

    showTransit();

    $("#name").val("");
    $("#destination").val("");
    $("#start-time").val("");
    $("#frequency").val("");
});

function showTransit() {
    $("tobdy").html("");

    database.ref().on("child_added", function(snapshot) {

        var sv = snapshot.val();
        var convertedTime = moment(sv.firstTrain, "HH:mm").subtract(1, "years");

        // var currentTime = moment();

        var diffTime = moment().diff(moment(convertedTime), "minutes");

        var timeRemainder = diffTime % sv.frequency;

        var minutesUntilTrain = sv.frequency - timeRemainder;

        var nextTrain = moment().add(minutesUntilTrain, "minutes");

        var tBody = $("tbody");
        var tRow = $("<tr>");
        var tName = $("<td>").text(sv.name);
        var tDestination = $("<td>").text(sv.destination);
        var tFrequency = $("<td>").text(sv.frequency);
        var tNextTrain = $("<td>").text(moment(nextTrain).format("hh:mm"));
        var tMinutestoNextTrain = $("<td>").text(minutesUntilTrain);

        tRow.append(tName, tDestination, tFrequency, tNextTrain, tMinutestoNextTrain);
        tBody.append(tRow);
   
})};


showTransit();
