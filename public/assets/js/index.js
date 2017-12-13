	var x = document.getElementById("demo");

	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition);
	    } else { 
	        x.innerHTML = "Geolocation is not supported by this browser.";
	    }
	}

	function showPosition(position) {
	    x.innerHTML = "Latitude: " + position.coords.latitude + 
	    "<br>Longitude: " + position.coords.longitude;
	    var coordinates = [position.coords.latitude, position.coords.longitude];
	    console.log("coordinate array:" + coordinates);

	    // Upon page load, lets start the process! 42.3601° N, 71.0589
		//google.maps.event.addDomListener(window, 'load', shortestDistance.init(position.coords.latitude, position.coords.longitude));
		return shortestDistance.init(position.coords.latitude, position.coords.longitude);
	}

var shortestDistance = function() {
  
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;
  var size = 0;
  var currentPosition;

  // An array of interesting places we want to potentially visit.
  var interestingPlaces = [
    {'title': 'Central Campus', 'latLng': new google.maps.LatLng(42.349965, -71.105125)},
    {'title': 'Photonics', 'latLng': new google.maps.LatLng(42.3492358, -71.1066377)},
    {'title': 'Questrom', 'latLng': new google.maps.LatLng(42.34943403, -71.0998893)},
    {'title': 'GSU', 'latLng': new google.maps.LatLng(42.35052031289201, -71.1091482476379)}
  ];

  // An array to store results from Google routing API.
  var routeResults = [];


  // Call this upon page load to set everything in motion!
  function initialize(currentLat, currentLng) {
    currentPosition = new google.maps.LatLng(currentLat, currentLng);
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
      zoom: 13,
      center: currentPosition
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);

    var marker = new google.maps.Marker({
          position: currentPosition,
          map: map,
          title: 'Currrent location'
    });

    var i = interestingPlaces.length;
     while (i--) {
      interestingPlaces[i].marker = new google.maps.Marker({
        position: interestingPlaces[i].latLng,
        map: map,
        title: interestingPlaces[i].title,
        icon: 'https://maps.google.com/mapfiles/ms/icons/green.png'
      });
    }

    findNearestPlace();
  }


  // Loops through all inteesting places to calculate route between our current position
  // and that place.
  function findNearestPlace() {
    var i = interestingPlaces.length;
    size = interestingPlaces.length;
    routeResults = [];
    while (i--) {
      calcRoute(interestingPlaces[i].latLng, storeResult);
    }
  }


  // A function to calculate the route between our current position and some desired end point.
  function calcRoute(end, callback) {
    var request = {
        origin: currentPosition,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        callback(response);
      } else {
        size--;
      }
    });
  }


  // Stores a routing result from the API in our global array for routes.
  function storeResult(data) {
    routeResults.push(data);
    if (routeResults.length === size) {
      findShortest();
    }
  }


  // Goes through all routes stored and finds which one is the shortest. It then
  // sets the shortest route on the map for the user to see.
  function findShortest() {
    var i = routeResults.length;
    var shortestIndex = 0;
    var shortestLength = routeResults[0].routes[0].legs[0].distance.value;

    while (i--) {
      if (routeResults[i].routes[0].legs[0].distance.value < shortestLength) {
        shortestIndex = i;
        shortestLength = routeResults[i].routes[0].legs[0].distance.value;
      }
    }
    directionsDisplay.setDirections(routeResults[shortestIndex]);
  }

  // Expose the initialize function publicly as "init".
  return {
    init: initialize
  };
}();

// Upon page load, lets start the process! 42.3601° N, 71.0589
google.maps.event.addDomListener(window, 'load', shortestDistance.init(42.352462890545716, -71.11831067363278));