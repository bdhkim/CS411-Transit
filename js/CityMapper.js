<!-- CityMapperCode -->

			function citycode(){
				// Prevent actual submit
				//e.preventDefault();

				// var location = document.getElementById('location-input').value;
				//
				// axios.get('https://maps.googleapis.com/maps/api/geocode/json?',{
				// 	params:{
				// 		address: location,
				// 		key: 'AIzaSyAxBW6beYoMaUPaH1zlSfBJgagoqFwv6lk'
				// 	}
				// })
				// .then(function(response){
				// 	// logging response
				// 	console.log(response);
				//
			  // var lat = response.data.results[0].geometry.location.lat;
			  // var lng = response.data.results[0].geometry.location.lng;
				//
				// var stringBuilder = "";
				// var comma = ",";
				// var combinedCoordinates = stringBuilder.concat(lat, comma); //this will comebine Latitude and Longitude
				// var combinedCoordinates2 = combinedCoordinates.concat(lng);
				// })
				// console.log(combinedCoordinates2);

				//geocode(e);  //derive the lat and lng verialbes



				console.log(lat);
				console.log(lng);

				var stringBuilder = "";
				var comma = ",";
				var combinedCoordinates = stringBuilder.concat(lat, comma); //this will comebine Latitude and Longitude
				var combinedCoordinates2 = combinedCoordinates.concat(lng);
				//})
				console.log(combinedCoordinates2);

					axios.get('https://developer.citymapper.com/api/1/traveltime/?',{
						params:{
							startcoord: '42.3601,-71.0589',
							endcoord:  combinedCoordinates2,
							time_type: 'arrival',
							key: '8d274cd0b080adeb82574dda0d9a58ef'
						}
					})

					.then(function(response){
						// logging response
						console.log(response);

						// Fromatted address
						var estimatedTime = response;
						var estimatedTimeOutput = `
							<ul class="list-group">
								<li class = "list-group-item">${estimatedTime}</li>
							</ul>
						`;


						// Output to app
						document.getElementById('estimate-time').innerHTML = estimatedTimeOutput;


					})
					.catch(function(error){
						console.log(error);
					});

				}

<!-- CityMapperCode -->
