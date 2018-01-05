//Check is js file is correctly associated
console.log("js running!");

//url for our google sheet date in json form
var googlesheetURL = "https://spreadsheets.google.com/feeds/list/198ropA6LQx2fl4H7GRq9xxkRbGCCasjd4mZVe2JfXmE/1/public/values?alt=json";
//initialize a global array for easy access to data
var googlesheetdata = [];

//function to put data on the page
function display(data){
	var table = document.getElementById("demo");

	for(var key in data.feed.entry){
		var newrow = table.insertRow();
		var timecell = newrow.insertCell(0);
		var latcell = newrow.insertCell(1);
		var longcell = newrow.insertCell(2);

		timecell.innerHTML = data.feed.entry[key]["gsx$time"]["$t"];
		latcell.innerHTML = data.feed.entry[key]["gsx$latitude"]["$t"];
		longcell.innerHTML = data.feed.entry[key]["gsx$longitude"]["$t"];

		//load data into array
		googlesheetdata.push([timecell.innerText, data.feed.entry[key]["gsx$latitude"]["$t"], data.feed.entry[key]["gsx$longitude"]["$t"]]);
	};

	//since the XHR is asynchronous, we can only add the marker after googlesheetdata is populated
	addMarkers();
}

//XHR for the data
var newRequest = new XMLHttpRequest();
newRequest.onreadystatechange = function(){
	if (this.readyState == 4 && this.status == 200){
		data = JSON.parse(newRequest.responseText);
		//console.log(googlesheetdata);
		display(data);
	}
};
newRequest.open("GET", googlesheetURL, true);
newRequest.send();


/* -------------- google map stuff below -------------*/
var map;

//Make the map, must have center and zoom
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
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