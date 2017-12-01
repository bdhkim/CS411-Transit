<!--Geocode Script-->


var geocoder = require('geocoder');

// Geocoding
    geocoder.geocode("1 silber way", function ( err, data ) {

        var lat = data.results[0].geometry.location.lat;   //derive longitude
        var lng = data.results[0].geometry.location.lng;   //derive longitude

        var stringBuilder = "";
        var comma = ",";
        var combinedCoordinates = stringBuilder.concat(lat, comma); //this will combine Latitude and Longitude
        var combinedCoordinates2 = combinedCoordinates.concat(lng); //to create the end point coordinates

        //console.log(combinedCoordinates2);
        //module.exports = { combinedCoordinates2: combinedCoordinates.concat(lng) };

        //module.exports.endCoordinate = combinedCoordinates2;
        console.log(combinedCoordinates2);


    });


//module.exports = combinedCoordinates2;



// request.get('https://maps.googleapis.com/maps/api/geocode/json?', {
//     'params': {
//         'address': 'username',
//         'key': 'password'
//
//     }
// });

			// function geocode(e){
			// 	// Prevent actual submit
			// 	e.preventDefault();
            //
			// 	var location = document.getElementById('location-input').value;
            //
			// 	axios.get('https://maps.googleapis.com/maps/api/geocode/json?',{
			// 			params:{
			// 				address: location,
			// 				key: 'AIzaSyAxBW6beYoMaUPaH1zlSfBJgagoqFwv6lk'
			// 			}
			// 		})
			// 		.then(function(response){
			// 			// logging response
			// 			console.log(response);
            //
			// 			// Fromatted address
			// 			var formattedAddress = response.data.results[0].formatted_address;
			// 			var formattedAddressOutput = `
			// 				<ul class="list-group">
			// 					<li class = "list-group-item">${formattedAddress}</li>
			// 				</ul>
			// 			`;
            //
			// 			// Address Components
			// 			var addressComponents = response.data.results[0].address_components;
			// 			var addressComponentsOutput = '<ul class="list-group">';
			// 			for(var i = 0;i < addressComponents.length;i++){
			// 				addressComponentsOutput += `
			// 					<li class="list-group-item"><strong>${addressComponents[i].types[0]}</strong>: ${addressComponents[i].long_name}</li>
			// 				`;
			// 			}
			// 			addressComponentsOutput += '</ul>';
            //
			// 			// Geometry
            // var lng = response.data.results[0].geometry.location.lng;
			// 			var lat = response.data.results[0].geometry.location.lat;
			// 			var geometryOutput = `
			// 				<ul class="list-group">
			// 					<li class="list-group-item"><strong>Latitude</strong>: ${lat}</li>
			// 					<li class="list-group-item"><strong>Longitude</strong>: ${lng}</li>
			// 				</ul>
			// 			`;
            //
			// 			//make the variable global!!
			// 			window.lng = lng;
			// 			window.lat = lat;
            //
            //
            // //transfer values to other api calls
            // //function citycode(lng, lat, e)
			// 			// Output to app
			// 			document.getElementById('formatted-address').innerHTML = formattedAddressOutput;
			// 			document.getElementById('address-components').innerHTML = addressComponentsOutput;
			// 			document.getElementById('geometry').innerHTML = geometryOutput;
            //
			// 		})
			// 		.catch(function(error){
			// 			console.log(error);
			// 		});
            //
			// }
