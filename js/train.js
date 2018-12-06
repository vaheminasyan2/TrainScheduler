// Initialize Firebase
var config = {
    apiKey: "AIzaSyBpStAH3eOyLvLRTMN9l8m5JqWL6pDd7Vk",
    authDomain: "vahedemo2.firebaseapp.com",
    databaseURL: "https://vahedemo2.firebaseio.com",
    projectId: "vahedemo2",
    storageBucket: "vahedemo2.appspot.com",
    messagingSenderId: "617727167482"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function (event) {

    // Grab user input
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var time = $("#time").val().trim();
    var frequency = $("#frequency").val().trim();

    if (trainName === "" || destination === "" || time === "" || frequency === "") {
        event.preventDefault();
    }

    else {
        // Create local object newTrain with train details
        var newTrain = {
            train: trainName,
            destination: destination,
            time: time,
            frequency: frequency
        };

        // Push newly created object to Firebase database
        database.ref().push(newTrain);

        // Clear out all text boxes
        $("#trainName").val("");
        $("#destination").val("");
        $("#time").val("");
        $("#frequency").val("");
    }
});


// Create Firebase event for adding newTrain 
database.ref().on("child_added", function (childSnapshot) {
    //console.log(childSnapshot.val());
    var train = childSnapshot.val().train;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;
    var nextArrivalTime = "";
    var minutesAway = "";
    console.log("First Train " + train + " time: " + time);

    // Using moment.js format currentTime and firstTrainTime to same format ("HH:mm")
    var currentTime = moment().format("HH:mm");
    var firstTrainTimeObject = moment(time, "HH:mm");
    var firstTrainTime = firstTrainTimeObject._i;

    //console.log(time);

    // Create function to calculate nextArrivalTime and minutesAway
    function nextArrival() {
        if (firstTrainTime > currentTime) {
            nextArrivalTime = firstTrainTime;
        }
        else {
            do {
                var z = moment((moment(firstTrainTime, "HH:mm").add(frequency, "m"))._d).format("HH:mm");
                firstTrainTime = z;
            }
            while (firstTrainTime < currentTime)
            nextArrivalTime = firstTrainTime;
        }

        // Receive minutes away in HH:mm format
        var minutesAwayNotFormatted = moment.utc(moment(nextArrivalTime, "HH:mm").diff(moment(currentTime, "HH:mm"))).format("HH:mm");

        // Convert minutes away in HH:mm format to minutes and assign it to minutesAway varialble
        minutesAway = moment.duration(minutesAwayNotFormatted).as("minutes");
    }
    nextArrival();

    // Create new row and append it to the Current Train Schedule 
    var newRow = $("<tr>").append(
        $("<td>").text(train),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrivalTime),
        $("<td>").text(minutesAway)
    );

    $(".train-table").append(newRow);
});

