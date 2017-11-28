/*
 Author: Kaviarasan Selvam
 Part of Project: BU Bus

 Format: First half = functions
         Second half = script
*/

/*
    Problem to be fixed
    Situation: I'm standing in front of CFA and I need to go to Questrom
    Algorithm: Nearest stop to me = CFA (instead of Amory St)
               Nearest stop to Questrom = 1 Silber way (instead of Blandford St)
               The algorithm is not able to find a path and returns "Too long..."
    Solution: I'm still working on this and would welcome any ideas from you guys
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

    var lowest = 0;
    var lowest_id = 0;
    for(stop_idx = 0; stop_idx < num_stops; stop_idx++)
    {
        if(dist_arr[stop_idx] < lowest)
        {
            lowest = dist_arr[stop_idx];
            lowest_id = stop_idx;
        }
    }

    var nearest_stop_id = stops_obj.ResultSet.Result[lowest_id].transloc_stop_id;
    return nearest_stop_id;
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
    num_times = arrival_time_arr.length;

    var lowest = Date.parse(arrival_time_arr[0]);
    var bus_id = 0;
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
    var api_3 = '&key=AIzaSyCs83Y5ODrwAOEko3-tJbZlNssYw56yd4A';

    var url = api_1 + start_coord + api_2 + end_coord + api_3;
    var distance_obj = loadJSON(url);

    walk_time = s_to_min(distance_obj.rows[0].elements[0].duration.value);
    return walk_time;
}

//******************************************************************************

//*****************************************************************************
//****************************   Script   *************************************
//*****************************************************************************

//Read JSON files to get objects
var url_livebus = 'http://www-devl.bu.edu/nisdev/php5/cs411/bu-mobile-backend/rpc/bus/livebus.json.php';
var livebus_obj = JSON.parse(Get(url_livebus));

var url_stops = 'http://www-devl.bu.edu/nisdev/php5/cs411/bu-mobile-backend/rpc/bus/stops.json.php';
var stops_obj = JSON.parse(Get(url_stops));


//Current coordinates
//*Should be a user input, but hard-coded (to StuVi2) for now*
var ori_lat = 42.353151;
var ori_lng = -71.11815;

//Destination coordinates
//*Should be a user input, but hard-coded (to Blandford St) for now*
var dest_lat = 42.34910929;
var dest_lng = -71.10044919;


//Find nearest bus stops to origin and destination
var start_stop_id = nearest_bus_stop(stops_obj, ori_lat, ori_lng);
var end_stop_id = nearest_bus_stop(stops_obj, dest_lat, dest_lng);


//Determine arrival of next bus to stop at start_stop_id
//Assumption: num_livebus does not change while the loop below is executed
var num_livebus = livebus_obj.totalResultsAvailable;

//Record estimated arrival time of buses at start_stop
arrival_time_arr = [];
bus_id_arr = [];

var bus_idx;
for(bus_idx = 0; bus_idx < num_livebus; bus_idx++)
{
    if(livebus_obj.totalResultsAvailable >= num_livebus)
    {
        if(livebus_obj.ResultSet.Result[bus_idx].hasOwnProperty('arrival_estimates'))
        {
            var num_arrival_estimates = livebus_obj.ResultSet.Result[bus_idx].arrival_estimates.length;

            var idx;
            for (idx = 0; idx < num_arrival_estimates; idx++)
            {
                if (livebus_obj.ResultSet.Result[bus_idx].arrival_estimates[idx].stop_id == start_stop_id)
                {
                    arrival_time_arr.push(livebus_obj.ResultSet.Result[bus_idx].arrival_estimates[idx].arrival_at);
                    bus_id_arr.push(livebus_obj.ResultSet.Result[bus_idx].id);
                    //console.log(livebus_obj.ResultSet.Result[bus_idx].id);
                }
            }
        }
    }
}

//Determine earliest bus to arrive (time until arrival + bus ID)
var time_until_arrival;
var bus_id;
if(arrival_time_arr.length > 0)
{
    var arrival_obj_arr = earliest_arrival_time(arrival_time_arr, bus_id_arr);
    var arrival_timestamp = arrival_obj_arr[0];
    time_until_arrival = ms_to_min(arrival_timestamp - Date.now());
    bus_id = arrival_obj_arr[1];
}
else
{
    //To be changed
    console.log("No buses");
    console.log("Too long. Not an option");
}


//Calculate the length (time) of the bus journey
var dest_arrival_time;
for(bus_idx = 0; bus_idx < num_livebus; bus_idx++)
{
    if (livebus_obj.totalResultsAvailable >= num_livebus)
    {
        if (livebus_obj.ResultSet.Result[bus_idx].bus_id == bus_id)
        {
            if (livebus_obj.ResultSet.Result[bus_idx].hasOwnProperty('arrival_estimates'))
            {
                var num_arrival_estimates = livebus_obj.ResultSet.Result[bus_idx].arrival_estimates.length;

                var idx;
                for (idx = 0; idx < num_arrival_estimates; idx++)
                {
                    if (livebus_obj.ResultSet.Result[bus_idx].arrival_estimates[idx].stop_id == end_stop_id)
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
    console.log("Too long. Not an option");
}


/*
    Get walking times
        1) from current location to nearest bus stop
        2) from destination bus stop to actual destination
*/

var total_time;
if ((arrival_time_arr.length > 0) && (typeof dest_arrival_time !== 'undefined'))
{
    var start_stop_lat;
    var start_stop_lng;
    var end_stop_lat;
    var end_stop_lng;

    var num_stops = stops_obj.totalResultsAvailable

    var stop_idx;
    for (stop_idx = 0; stop_idx < num_stops; stop_idx++) {
        if (stops_obj.ResultSet.Result[stop_idx].transloc_stop_id == start_stop_id)
            start_stop_lat = stops_obj.ResultSet.Result[stop_idx].stop_lat;
        start_stop_lng = stops_obj.ResultSet.Result[stop_idx].stop_lng;

        if (stops_obj.ResultSet.Result[stop_idx].transloc_stop_id == end_stop_id)
            end_stop_lat = stops_obj.ResultSet.Result[stop_idx].stop_lat;
        end_stop_lng = stops_obj.ResultSet.Result[stop_idx].stop_lng;
    }


    var ori_coord = ori_lat.toString() + ',' + ori_lng.toString();
    var dest_coord = dest_lat.toString() + ',' + dest_lng.toString();

    var start_stop_coord = start_stop_lat.toString() + ',' + start_stop_lng.toString();
    var end_stop_coord = end_stop_lat.toString() + ',' + end_stop_lng.toString();

    var walking_time1 = calculate_walking_time(ori_coord, start_stop_coord);
    var walking_time2 = calculate_walking_time(end_stop_coord, dest_coord);

    //Calculate actual total time
    if(time_until_arrival < walking_time1)
    {
        console.log("You will miss the bus. This is not an option.")
        total_time = 0;
    }
    else
    {
        total_time = time_until_arrival + bus_travel_time + walking_time2;
        console.log("The total time to reach your destination: " + Math.ceil(total_time) + " minutes");
    }
}

//****************************************************************************

//****************************************************************************
//***********   Important Information    *************************************
//****************************************************************************

//google maps geocode api key = AIzaSyBAGXXushBzgfMSuAMkR9GqwEdbE3OGyL8
//google maps distance matrix api key =  AIzaSyCs83Y5ODrwAOEko3-tJbZlNssYw56yd4A
//google maps geolocation api key =  AIzaSyBb4z8_yEdG3rEZh0e220tI1oZdNKfHVbA

//****************************************************************************





