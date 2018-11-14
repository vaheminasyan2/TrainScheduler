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
    event.preventDefault();

    // Grab user input
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var time = $("#time").val().trim();
    var frequency = $("#frequency").val().trim();

    //console.log(trainName, destination, time, frequency);

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
});

// Create Firebase event for adding newTrain 
database.ref().on("child_added", function(childSnapshot) {
    //console.log(childSnapshot.val());
    var train = childSnapshot.val().train;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;

    //console.log(train, destination, time, frequency);

    // Calculate Minutes away
    var currentTime = moment().format("HH:mm");
    //var minutesAway = 
    console.log(currentTime);


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(train),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text("coming soon"),
        $("<td>").text("coming soon")
    );

    $(".train-table").append(newRow);
});

