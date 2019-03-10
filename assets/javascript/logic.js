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
var stopStation = "";
var firstTrain = "00:00";
var frequency = 1;
var buttonClicked = "red";

runTime();
// $(document).ready(setInterval);

setInterval(runTime, 60000);

function runTime() {
    var currentTime = new Date ( );
    var currentHours = currentTime.getHours ( );
    var currentMinutes = currentTime.getMinutes ( );
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    var currentTimeString = currentHours + ":" + currentMinutes;
    document.getElementById("clock").firstChild.nodeValue = currentTimeString;
};

$("#submit-button").on("click", function(event) {
    event.preventDefault();

    name = $("#name").val().trim();
    console.log(name);
    stopStation = $("#stop-station").val().trim();
    firstTrain = $("#start-time").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        type: "train",
        name: name,
        stopStation: stopStation,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    })
    // console.log(snapshot.key);

    $("#name").val("");
    $("#stop-station").val("");
    $("#start-time").val("");
    $("#frequency").val("");
});

function showTransit() {

    var userSelect = $(this).val();
    console.log(userSelect);

    $("tbody").html("");

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
        var tstopStation = $("<td>").text(sv.stopStation);
        var tFrequency = $("<td>").text(sv.frequency);
        var tNextTrain = $("<td>").text(moment(nextTrain).format("hh:mm"));
        var tMinutestoNextTrain = $("<td>").text(minutesUntilTrain);
        // var tClose = $('<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        var newPostKey = firebase.database().ref().child('train').push().key;
        console.log(newPostKey);

        if (sv.name === userSelect || userSelect === "all") {
            tRow.append(tName, tstopStation, tFrequency, tNextTrain, tMinutestoNextTrain).attr("id", newPostKey);
            tBody.append(tRow);
        };
})};

$(document).on("click", ".train", showTransit);

// showTransit();
