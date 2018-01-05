//Check is js file is correctly associated
$(document).ready(function(){
	console.log( "jquery ready!" );
});

//url for our google sheet date in json form
var googlesheetURL = "https://spreadsheets.google.com/feeds/list/198ropA6LQx2fl4H7GRq9xxkRbGCCasjd4mZVe2JfXmE/1/public/values?alt=json";
//initialize a global array for easy access to data
var googlesheetdata = [];

//function to put data on the page
function display(data){

	$.each(data.feed.entry, function(key, value){
		var row = $("<tr />");

		row.append($("<td>" + value["gsx$time"]["$t"] + "</td>"))
		.append($("<td>" + value["gsx$latitude"]["$t"] + "</td>"))
		.append($("<td>" + value["gsx$longitude"]["$t"] + "</td>"))

		$("#demo").append(row);
		
		//load data into array
		googlesheetdata.push([value["gsx$time"]["$t"], value["gsx$latitude"]["$t"], value["gsx$longitude"]["$t"]]);
	});

	//since the XHR is asynchronous, we can only add the marker after googlesheetdata is populated
	addMarkers();
};

//jquery wrapper of XHR for the data
$.ajax({
	url: googlesheetURL,
	dataType: "json"
}).done(function(data){
	//console.log(data);
	display(data);
});


/* -------------- google map stuff below -------------*/
var map;

//Make the map, must have center and zoom
function initMap() {
	map = new google.maps.Map($("#map")[0], {
		center: {lat: 24.8138, lng: 120.9675},
		zoom: 13
	});
}

//loop through the data and add markers
function addMarkers() {
	console.log("adding markers...");

	var n = googlesheetdata.length;
	var i, newMarker;

	for (i = 0; i < n; i++){
		newMarker = new google.maps.Marker({
			position: new google.maps.LatLng(googlesheetdata[i][1], googlesheetdata[i][2]),
			title: googlesheetdata[i][0],
			map: map
		});
	}
}