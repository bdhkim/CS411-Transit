/*
 Author: Kaviarasan Selvam
 Part of Project: BU Bus

 Format: First half = functions
         Second half = script
*/

//*******************************************************************************
//*************   Functions   ***************************************************
//*******************************************************************************

/*
    Input: URL to JSON file
    Output: JSON object
 */
function Get(json_url)
{
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",json_url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}


/*
    Input: Angle in degrees
    Output: Angle in radians
 */
function degrees_to_radians(angle_in_degrees)
{
    return angle_in_degrees*Math.PI/180;
}


/*
    Input: Location 1 latitude
           Location 1 longitude
           Location 2 latitude
           Location 2 longitude
    Output: 3D distance between 2 locations (haversine formula)
 */
function distance_calc(lat1, lng1, lat2, lng2)
{
    var R = 6371e3; // metres
    var phi1 = degrees_to_radians(lat1);
    var phi2 = degrees_to_radians(lat2);
    var delta_phi = degrees_to_radians(lat2-lat1);
    var delta_lambda = degrees_to_radians(lng2-lng1);

    var a = Math.sin(delta_phi/2) * Math.sin(delta_phi/2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(delta_lambda/2) * Math.sin(delta_lambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var distance = R * c;

    return distance;
}


/*
    Input: BU Bus Stops object
           Location latitude
           Location longitude
    Output: Stop ID of BU Bus Stop closest to location
 */
function nearest_bus_stop(stops_obj, lat, lng)
{
    var num_stops = stops_obj.totalResultsAvailable;
    var dist_arr = [];

    var stop_idx;
    for(stop_idx = 0; stop_idx < num_stops; stop_idx++)
    {
        var stop_lat = stops_obj.ResultSet.Result[stop_idx].stop_lat;
        var stop_lng = stops_obj.ResultSet.Result[stop_idx].stop_lon;

        var distance = distance_calc(lat, lng, stop_lat, stop_lng);

        dist_arr.push(distance);
    }

    var lowest = 100000000;
    var lowest_id = 0;
    for(stop_idx = 0; stop_idx < num_stops; stop_idx++)
    {
        if(dist_arr[stop_idx] < lowest)
        {
            lowest = dist_arr[stop_idx];
            lowest_id = stop_idx;
        }
    }

    var nearest_stop_id = stops_obj.ResultSet.Result[lowest_id].stop_id;
    var nearest_stop_direction_id = stops_obj.ResultSet.Result[lowest_id].direction_id;
    return [nearest_stop_id, nearest_stop_direction_id];
}


function get_index(array, value)
{
    var i;
    var idx_to_return;
    for (i = 0; i < array.length; i++)
    {
        if (array[i] == value)
        {
            idx_to_return = i;
        }
    }

    return idx_to_return;
}



/*
    Input: Origin Latitude
           Origin Longitude
           Destination Latitude
           Destination Longitude
    Output: ID of closest stop to origin
            ID of closest stop to destination
*/
function optimal_nearest_stops(stops_obj, ori_lat, ori_lng, dest_lat, dest_lng)
{
    var start_arr = nearest_bus_stop(stops_obj, ori_lat, ori_lng);
    var end_arr = nearest_bus_stop(stops_obj, dest_lat, dest_lng);

    var new_start_stop_id;
    var new_end_stop_id;

    var outbound_stops = ["C1","C2","C3","C4","C5","C6","C7","C8"]; //direction: 0 (towards stuvi)
    var inbound_stops = ["M1","M2","M3","M4","M5","M6","M7"];       //direction: 1 (away from stuvi)
    var stops_pairs = [["C8","M1"],["C7","M2"],["C6","M3"],["C5","M4"],["C4","M5"],["C2","M6"],["C1","M7"]];
    var stops_pairs_obj = {"C8":"M1", "M1":"C8", "C7":"M2", "M2":"C7", "C6":"M3", "M3":"C7", "C5":"M4", "M4":"C5", "C4":"M5", "M5":"C4", "C2":"M6", "M6":"C2", "C1":"M7", "M7":"C1"};


    var same_route_correct_direction_flag = false;
    var same_route_wrong_direction_flag = false;

    //geographical direction from current stop to destination based on route of current stop
    var different_route_correct_direction_flag = false;
    var different_route_wrong_direction_flag = false;

    //Same route
    if (start_arr[1] == end_arr[1])
    {
        //If outbound
        if (start_arr[1] == 0)
        {
            if (get_index(outbound_stops,end_arr[0]) > get_index(outbound_stops,start_arr[0]))
            {
                same_route_correct_direction_flag = true;
            }
            else
            {
                same_route_wrong_direction_flag = true;
            }
        }
        //If inbound
        else if (start_arr[1] == 1)
        {
            if (get_index(inbound_stops,end_arr[0]) > get_index(inbound_stops,start_arr[0]))
            {
                same_route_correct_direction_flag = true;
            }
            else
            {
                same_route_wrong_direction_flag = true;
            }
        }
        else
        {
            console.log("Error: Same route, but different route number (problem with API)");
        }
    }

    //If different route and current location is Danielsen, BU Bus not a viable option
    else if ((start_arr[0] == "C3") || (end_arr[0] == "C3"))
       {
           console.log("Too long. Not an option (Danielsen)....");
       }

    //Different route
    else
    {
        //Stop opposite from current start_stop
        var temp_stop_id = stops_pairs_obj[start_arr[0]];

        //If end_stop is on the Outbound Route
        if (end_arr[1] == 0)
        {

            if (get_index(outbound_stops,temp_stop_id) > get_index(outbound_stops,end_arr[0]))
            {
                different_route_correct_direction_flag = true;
            }
            else
            {
                different_route_wrong_direction_flag = true;
            }

        }

        //If end_stop is on the Inbound Route
        else if (end_arr[1] == 1)
        {
            if (get_index(inbound_stops,temp_stop_id) > get_index(inbound_stops,end_arr[0]))
            {
                different_route_correct_direction_flag = true;
            }
            else
            {
                different_route_wrong_direction_flag = true;
            }

        }
    }


    //Now to determine the correct stops
    var new_start_stop_id;
    var new_end_stop_id;

    if (same_route_correct_direction_flag)
    {
        //console.log("Stops in correct direction");
        new_start_stop_id = start_arr[0];
        new_end_stop_id = end_arr[0];
    }

    else if ((start_arr[0] == "C3") || (end_arr[0] == "C3"))
    {
        //console.log("Too long. Not an option (Danielsen)....");
        new_start_stop_id = start_arr[0];
        new_end_stop_id = end_arr[0];
    }

    //On the same route, but end_stop is before start stop
    else if (same_route_wrong_direction_flag)
    {
        new_start_stop_id = stops_pairs_obj[start_arr[0]];
        new_end_stop_id = stops_pairs_obj[end_arr[0]];

        //console.log("Stops are on the same route, but the destination is before the origin on the route");
        //console.log("Take bus from opposite stop from origin, and get off at opposite stop from destination");
    }

    //On a different route, and the end_stop is after the start_stop in the direction of travel from the start_stop
    else if (different_route_correct_direction_flag)
    {
        new_start_stop_id = start_arr[0];
        new_end_stop_id = stops_pairs_obj[end_arr[0]];

        //console.log("Stops are on different routes. The destination is in the direction of the bus if taken from current origin stop.");
        //console.log("Take bus current stop in origin, and get off at opposite stop from destination.");
    }

    //On a different route, and the end_stop is after the opposite of the start stop on the route of the end stop
    else if(different_route_wrong_direction_flag)
    {
        new_start_stop_id = stops_pairs_obj[start_arr[0]];
        new_end_stop_id = end_arr[0];

        //console.log("Stops are on different routes. The actual origin stop should be on the opposite side of the current origin stop.");
        //console.log("Walk across the street, and take the bus from the stop opposite to the current origin stop.");
    }

    else
    {
        console.log("Error in stops");
        new_start_stop_id = start_arr[0];
        new_end_stop_id = end_arr[0];
    }

    return [new_start_stop_id, new_end_stop_id];
}


/*
    Input: Array of arrival times at chosen stop
           Array of BU Bus IDs corresponding to arrival time
    Output: Earliest time until the arrival of the first bus at the chosen stop and the corresponding BU Bus ID

    Note: Not considering cases when the earliest bus arrives the next day
          Print "Too long..." when this is the case (done in script)
 */
function earliest_arrival_time(arrival_time_arr, bus_id_arr)
{
    var num_times = arrival_time_arr.length;

    var lowest = Date.parse(arrival_time_arr[0]);
    var bus_id = 0;
    var time_idx;
    for(time_idx = 1; time_idx < num_times; time_idx++)
    {
        var arrival_time = Date.parse(arrival_time_arr[time_idx]);

        if(arrival_time < lowest)
        {
            lowest = arrival_time;
            bus_id = bus_id_arr[time_idx];
        }
    }

    return [lowest, bus_id];
}


/*
    Input: Time in microseconds
    Output: Time in minutes
 */
function ms_to_min(time)
{
    return time/60000.0;
}


/*
    Input: Time in seconds
    Output: Time in minutes
 */
function s_to_min(time)
{
    return time/60.0;
}


/*
    Input: Start coordinates
           End coordinates
    Output: Time it takes to walk between 2 coordinates
 */
function calculate_walking_time(start_coord, end_coord)
{
    var walk_time;

    var api_1 = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=';
    //var start_coord;
    var api_2 = '&destinations=';
    //var end_coord;
    var api_3 = '&key=AIzaSyCs83Y5ODrwAOEko3-tJbZlNssYw56yd4A&mode=walking';

    var url = api_1 + start_coord + api_2 + end_coord + api_3;
    var distance_obj = JSON.parse(Get(url));

    walk_time = s_to_min(distance_obj.rows[0].elements[0].duration.value);
    return walk_time;
}

//******************************************************************************

//*****************************************************************************
//****************************   Script   *************************************
//*****************************************************************************

function bu_bus()
{
    //Read JSON files to get objects
    var url_livebus = 'http://www-devl.bu.edu/nisdev/php5/cs411/bu-mobile-backend/rpc/bus/livebus.json.php';
    var livebus_obj = JSON.parse(Get(url_livebus));

    var url_stops = 'http://www-devl.bu.edu/nisdev/php5/cs411/bu-mobile-backend/rpc/bus/stops.json.php';
    var stops_obj = JSON.parse(Get(url_stops));


    //Current coordinates
    //*Should be a user input, but hard-coded (to StuVi2) for now*
    //var ori_lat = 42.353151;
    //var ori_lng = -71.11815;
    //Marsh
    //var ori_lat = 42.3501817;
    //var ori_lng = -71.10657938;
    //St.Mary's street
    var ori_lat = 42.34982489;
    var ori_lng = -71.1064171;

    //Destination coordinates
    //*Should be a user input, but hard-coded (to Blandford St) for now*
    var dest_lat = 42.34910929;
    var dest_lng = -71.10044919;
    //var dest_lat = 42.3501817;
    //var dest_lng = -71.10657938;

    //Find nearest bus stops to origin and destination
    var stops = optimal_nearest_stops(stops_obj, ori_lat, ori_lng, dest_lat, dest_lng);
    var start_stop_id = stops[0];
    var end_stop_id = stops[1];


    if (start_stop_id == end_stop_id)
    {
        return "Don't be lazy. Just walk.";
    }


    //At this point, start_stop_id != end_stop_id
    var start_transloc_stop_id;
    var end_transloc_stop_id;

    var num_stops = stops_obj.totalResultsAvailable;
    var stop_idx;

    for (stop_idx = 0; stop_idx < num_stops; stop_idx ++)
    {
        if (stops_obj.ResultSet.Result[stop_idx].stop_id == start_stop_id)
        {
            start_transloc_stop_id = stops_obj.ResultSet.Result[stop_idx].transloc_stop_id;
        }
        if (stops_obj.ResultSet.Result[stop_idx].stop_id == end_stop_id)
        {
            end_transloc_stop_id = stops_obj.ResultSet.Result[stop_idx].transloc_stop_id;
        }
    }

    if (start_stop_id == "C8")
    {
        start_transloc_stop_id = "4160714";
    }
    if (end_stop_id == "C8")
    {
        end_transloc_stop_id = "4160714";
    }


    //Determine arrival of next bus to start_stop
    //Assumption: num_livebus does not change while the loop below is executed
    var num_livebus = livebus_obj.totalResultsAvailable;
    if (num_livebus == 0)
    {
        return "No buses are running";
    }

    //Record estimated arrival time of buses at start_stop
    var arrival_time_arr = [];
    var bus_id_arr = [];

    var bus_idx;
    for (bus_idx = 0; bus_idx < num_livebus; bus_idx++)
    {
        if (livebus_obj.totalResultsAvailable >= num_livebus)
        {
            if (livebus_obj.ResultSet.Result[bus_idx].hasOwnProperty('arrival_estimates'))
            {
                var num_arrival_estimates = livebus_obj.ResultSet.Result[bus_idx].arrival_estimates.length;

                var idx;
                for (idx = 0; idx < num_arrival_estimates; idx++)
                {
                    if (livebus_obj.ResultSet.Result[bus_idx].arrival_estimates[idx].stop_id == start_transloc_stop_id)
                    {
                        arrival_time_arr.push(livebus_obj.ResultSet.Result[bus_idx].arrival_estimates[idx].arrival_at);
                        bus_id_arr.push(livebus_obj.ResultSet.Result[bus_idx].id);
                    }
                }
            }
        }
    }

    //Determine earliest bus to arrive (time until arrival + bus ID)
    var time_until_arrival;
    var bus_id;
    if (arrival_time_arr.length > 0)
    {
        var arrival_obj_arr = earliest_arrival_time(arrival_time_arr, bus_id_arr);
        var arrival_timestamp = arrival_obj_arr[0];
        time_until_arrival = ms_to_min(arrival_timestamp - Date.now());
        bus_id = arrival_obj_arr[1];
    }
    else
    {
        //console.log("No buses");
        //console.log("Too long. Not an option");
        return "Too long. Not an option";
    }


    //Calculate the length (time) of the bus journey
    var dest_arrival_time;
    for (bus_idx = 0; bus_idx < num_livebus; bus_idx++)
    {
        if (livebus_obj.totalResultsAvailable >= num_livebus)
        {
            if (livebus_obj.ResultSet.Result[bus_idx].id == bus_id)
            {
                if (livebus_obj.ResultSet.Result[bus_idx].hasOwnProperty('arrival_estimates'))
                {
                    var num_arrival_estimates = livebus_obj.ResultSet.Result[bus_idx].arrival_estimates.length;

                    var idx;
                    for (idx = 0; idx < num_arrival_estimates; idx++)
                    {
                        if (livebus_obj.ResultSet.Result[bus_idx].arrival_estimates[idx].stop_id == end_transloc_stop_id)
                        {
                            dest_arrival_time = livebus_obj.ResultSet.Result[bus_idx].arrival_estimates[idx].arrival_at;
                            dest_arrival_time = Date.parse(dest_arrival_time);
                        }
                    }
                }
            }

        }
    }

    var bus_travel_time;
    if (typeof dest_arrival_time !== 'undefined')
    {
        bus_travel_time = ms_to_min(dest_arrival_time - Date.now());
    }
    else
    {
        console.log("Unable to detect destination stop");
        //console.log("Too long. Not an option");
        return "Too long. Not an option";
    }


    //Calculate walking time
    var start_stop_lat;
    var start_stop_lng;
    var end_stop_lat;
    var end_stop_lng;

    for (stop_idx = 0; stop_idx < num_stops; stop_idx++)
    {
        if (stops_obj.ResultSet.Result[stop_idx].stop_id == start_stop_id)
        {
            start_stop_lat = stops_obj.ResultSet.Result[stop_idx].stop_lat;
            start_stop_lng = stops_obj.ResultSet.Result[stop_idx].stop_lon;
        }
        if (stops_obj.ResultSet.Result[stop_idx].stop_id == end_stop_id)
        {
            end_stop_lat = stops_obj.ResultSet.Result[stop_idx].stop_lat;
            end_stop_lng = stops_obj.ResultSet.Result[stop_idx].stop_lon;
        }
    }


    var ori_coord = ori_lat.toString() + ',' + ori_lng.toString();
    var dest_coord = dest_lat.toString() + ',' + dest_lng.toString();

    var start_stop_coord = start_stop_lat.toString() + ',' + start_stop_lng.toString();
    var end_stop_coord = end_stop_lat.toString() + ',' + end_stop_lng.toString();

    var walking_time1 = calculate_walking_time(ori_coord, start_stop_coord);
    var walking_time2 = calculate_walking_time(end_stop_coord, dest_coord);

    //Calculate actual total time
    var total_time;
    if (time_until_arrival < walking_time1)
    {
        //console.log("You will miss the bus. This is not an option.")
        total_time = 0;
        return "You will miss the bus. This is not an option.";
    }
    else
    {
        total_time = time_until_arrival + bus_travel_time + walking_time2;
        //console.log("time_until_arrival: " + time_until_arrival);
        //console.log("bus_travel_time: " + bus_travel_time);
        //console.log("walking_time2: " + walking_time2);
        console.log("The total time to reach your destination: " + Math.ceil(total_time) + " minute(s)");
        //return "The total time to reach your destination: " + Math.ceil(total_time) + " minutes";
    }
}

var results = bu_bus();
console.log(results);

//****************************************************************************

//****************************************************************************
//***********   Important Information    *************************************
//****************************************************************************

//google maps geocode api key = AIzaSyBAGXXushBzgfMSuAMkR9GqwEdbE3OGyL8
//google maps distance matrix api key =  AIzaSyCs83Y5ODrwAOEko3-tJbZlNssYw56yd4A
//google maps geolocation api key =  AIzaSyBb4z8_yEdG3rEZh0e220tI1oZdNKfHVbA

//****************************************************************************