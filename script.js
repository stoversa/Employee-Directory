$(document).ready(function(){

//
  const config = {
    apiKey: "AIzaSyDkyyg7TaPD5Zw2CKxjcdfB4pGKTc8Rb5Y",
    authDomain: "employee-data-1a57c.firebaseapp.com",
    databaseURL: "https://employee-data-1a57c.firebaseio.com",
    projectId: "employee-data-1a57c",
    storageBucket: "employee-data-1a57c.appspot.com",
    messagingSenderId: "332358395563"
  };
	//add your FireBase code above as const config =

	firebase.initializeApp(config); //initialize firebase


	// Create a variable to reference the database.
	const dbRef = firebase.database().ref('recentUserPush');

	// Capture Button Click
	$("#submit").click(function(event) {
	    event.preventDefault();

	   var thisname = $("#name").val().trim()
	    // push instead of set (notice the additional property)
	    dbRef.push({
	        name: thisname,
	        role: $("#role").val().trim(),
	        startDate: $("#start-date").val().trim(),
	        rate: $("#rate").val().trim(),
	        dateAdded: firebase.database.ServerValue.TIMESTAMP
	    });

	    $("#this-employee").text(thisname);
	    $("#t-body").empty();
	    $(".form-control").val("")

	    populateTable();
	});

	function populateTable() {
		dbRef.on("child_added", function(snapshot) {
		    // Log everything that's coming out of snapshot
		    var response = snapshot.val();
		    // console.log(response);
		     var name = response.name;
			  var role = response.role;
			  var startDate = response.startDate;
			  var rate = response.rate;

		    renderTableBody(name, role, startDate, rate);

		}, function(err) {
		    // Handle errors
		    console.log("Error: ", err.code);
		});
	}

	function updateTable () {
	  dbRef.orderByChild('dateAdded').limitToLast(1).on('child_added',function(snapshot){
	      // Set most recent user
	      renderTableBody(snapshot.val());
	  },function(err) {
	      console.log("Error: ", err.code);
	  });
	}


	function renderTableBody(name, role, startDate, rate) {
		
		var dateC = startDate; //necessary to convert date
		var dateB = moment(); //present date
		var monthsWorked = dateB.diff(dateC, 'months') //creates months worked
		var billed = rate * monthsWorked; //creates billed value
		var tbody = $("#t-body"); //grabs the tbody on the page
		var tr = $("<tr>"); //creates new table row
		var nameTd = $("<td>"); //first td - employee name
		nameTd.text(name);
		var roleTd = $('<td>'); //second td - role
		roleTd.text(role);
		var stdTd = $("<td>"); //third td - start date
		stdTd.text(startDate);
		var monthsTd = $("<td>"); //fourth td - months worked
		monthsTd.text(monthsWorked);
		var rateTd = $("<td>"); //fifth td - monthly rate
		rateTd.text(rate);
		var billedTd = $("<td>"); //sixth td - total billed
		billedTd.text("$" + billed); 

		tr.append(nameTd, roleTd, stdTd, monthsTd, rateTd, billedTd);
		tbody.append(tr);

		}; // end of renderTableBody

	populateTable(); //should run on load
});