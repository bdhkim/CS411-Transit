// <!-- CityMapperCode -->





// var geo = require('./Geocode');
// console.log(geo);


//var geo = require('./Geocode.js')(combinedCoordinates2);

//console.log("coordinate is " + endC);

var geocoder = require('./Geocode');

console.log("geocode is " + geocoder;
//console.log(geocoder)

// geocoder.geocode("1 silber way", function ( err, data ) {
//
//     var lat = data.results[0].geometry.location.lat;   //derive longitude
//     var lng = data.results[0].geometry.location.lng;   //derive longitude
//
//     var stringBuilder = "";
//     var comma = ",";
//     var combinedCoordinates = stringBuilder.concat(lat, comma); //this will combine Latitude and Longitude
//     var combinedCoordinates2 = combinedCoordinates.concat(lng); //to create the end point coordinates
//
//     //console.log(combinedCoordinates2);
//     //module.exports = { combinedCoordinates2: combinedCoordinates.concat(lng) };
//
//     //module.exports.endCoordinate = combinedCoordinates2;
//     console.log("geocode is running");
//
//
// });

// var axios = require('axios')
// axios.get('https://developer.citymapper.com/api/1/traveltime/?', {
//
//     params:{
// 		startcoord: '42.3601,-71.0589',
//         endcoord:  geocoder,
//         time_type: 'arrival',
//         key: '8d274cd0b080adeb82574dda0d9a58ef'
//     }
//
//     })
//     .then(function (response) {
//     console.log(response.data/*.travel_time_minutes*/);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
//


// 			function citycode(){
// 				// Prevent actual submit
// 				//e.preventDefault();
//
// 				// var location = document.getElementById('location-input').value;
// 				//
// 				// axios.get('https://maps.googleapis.com/maps/api/geocode/json?',{
// 				// 	params:{
// 				// 		address: location,
// 				// 		key: 'AIzaSyAxBW6beYoMaUPaH1zlSfBJgagoqFwv6lk'
// 				// 	}
// 				// })
// 				// .then(function(response){
// 				// 	// logging response
// 				// 	console.log(response);
// 				//
// 			  // var lat = response.data.results[0].geometry.location.lat;
// 			  // var lng = response.data.results[0].geometry.location.lng;
// 				//
// 				// var stringBuilder = "";
// 				// var comma = ",";
// 				// var combinedCoordinates = stringBuilder.concat(lat, comma); //this will comebine Latitude and Longitude
// 				// var combinedCoordinates2 = combinedCoordinates.concat(lng);
// 				// })
// 				// console.log(combinedCoordinates2);
//
// 				//geocode(e);  //derive the lat and lng verialbes
//
//
//
// 				console.log(lat);
// 				console.log(lng);
//
// 				var stringBuilder = "";
// 				var comma = ",";
// 				var combinedCoordinates = stringBuilder.concat(lat, comma); //this will comebine Latitude and Longitude
// 				var combinedCoordinates2 = combinedCoordinates.concat(lng);
// 				//})
// 				console.log(combinedCoordinates2);
//
// 					axios.get('https://developer.citymapper.com/api/1/traveltime/?',{
// 						params:{
// 							startcoord: '42.3601,-71.0589',
// 							endcoord:  combinedCoordinates2,
// 							time_type: 'arrival',
// 							key: '8d274cd0b080adeb82574dda0d9a58ef'
// 						}
// 					})
//
// 					.then(function(response){
// 						// logging response
// 						console.log(response);
//
// 						// Fromatted address
// 						var estimatedTime = response;
// 						var estimatedTimeOutput = `
// 							<ul class="list-group">
// 								<li class = "list-group-item">${estimatedTime}</li>
// 							</ul>
// 						`;
//
//
// 						// Output to app
// 						document.getElementById('estimate-time').innerHTML = estimatedTimeOutput;
//
//
// 					})
// 					.catch(function(error){
// 						console.log(error);
// 					});
//
// 				}
//
// <!-- CityMapperCode -->
