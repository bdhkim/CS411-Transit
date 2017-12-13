import { Component, OnInit } from '@angular/core';
import { UberService} from "../uber.service";

@Component({
  selector: 'app-uber',
  templateUrl: './uber.component.html',
  styleUrls: ['./uber.component.css'],
  providers: [UberService]
})
export class UberComponent implements OnInit {
  times: Time[];
  lat: number;
  lng: number;
  address: any;
  address2: any;
  coord: any;
  lat2:any;
  lng2:any;
  busTimes:Time[];
  walkTimes:Time[];
  lyftTimes: Time[];
  shuttleTimes:Time[];



  constructor(private uberService: UberService) {
  }

  ngOnInit() {
    this.lat=0;
    this.lng=0;
    this.lat2=0;
    this.lng2=0;
    this.address;
    this.address2;
    this.coord;
    this.times;
    this.busTimes;
    this.walkTimes;
    this.lyftTimes;
    this.shuttleTimes;


    /*return this.uberService.getUberTimes('http://localhost:3000/Uber/location?lat=3.1357169&lng=101.6881501')
      .subscribe((times) => {
        //console.log(times);
        this.times = times;

  })*/
  }

  Coordinates(address, address2){

    this.address = address;
    this.address2 = address2;
    this.lat = 0;

    this.uberService.getUberTimes('http://localhost:3000/Geocode/geocode?address=' +this.address + '&Destination=' +this.address2)
      .subscribe((coord) => {
        this.coord = coord;
        this.lat = coord[0];
        this.lng = coord[1];

        this.Coordinates2(this.lat, this.lng, this.address2);


      });

    return false;
  }

  Coordinates2(lat, lng, address2){
    this.address2 = address2;
    this.lat = lat;
    this.lng = lng;

    this.uberService.getUberTimes('http://localhost:3000/Geocode/geocode?address=' +this.address2)
      .subscribe((coord) => {
        this.coord = coord;
        this.lat2 = coord[0];
        this.lng2 = coord[1];


        this.dataPoints(this.lat, this.lng, this.lat2, this.lng2);
        this.BusEstimates(this.lat, this.lng, this.lat2, this.lng2);
        this.WalkingEstimates(this.lat, this.lng, this.lat2, this.lng2);
        this.LyftEstimates(this.lat, this.lng, this.lat2, this.lng2);
        this.ShuttleEstimates(this.lat, this.lng, this.lat2, this.lng2);
      });
  };

  ShuttleEstimates(StartLat, StartLng, EndLat, EndLng){
    this.lat = StartLat.toString();
    this.lng = StartLng.toString();
    this.lat2 = EndLat.toString();
    this.lng2 = EndLng.toString();

    this.uberService.getUberTimes('http://localhost:3000/Shuttle/Shuttle?lat=' + this.lat + '&lng=' +this.lng + '&lat2='+this.lat2 +'&lng2='+this.lng2)
      .subscribe((shuttleTimes) => {

        this.shuttleTimes = shuttleTimes;
      });
    return false;
  };

  WalkingEstimates(StartLat, StartLng, EndLat, EndLng){
    this.lat = StartLat.toString();
    this.lng = StartLng.toString();
    this.lat2 = EndLat.toString();
    this.lng2 = EndLng.toString();

    this.uberService.getUberTimes('http://localhost:3000/Walking/Walking?lat=' + this.lat + '&lng=' +this.lng + '&lat2='+this.lat2 +'&lng2='+this.lng2)
      .subscribe((walkTimes) => {

        this.walkTimes = walkTimes;

      });
    return false;
  };
  LyftEstimates(StartLat, StartLng, EndLat, EndLng){
    this.lat = StartLat.toString();
    this.lng = StartLng.toString();
    this.lat2 = EndLat.toString();
    this.lng2 = EndLng.toString();

    this.uberService.getUberTimes('http://localhost:3000/Lyft/Lyft?lat=' + this.lat + '&lng=' +this.lng + '&lat2='+this.lat2 +'&lng2='+this.lng2)
      .subscribe((lyftTimes) => {

        this.lyftTimes = lyftTimes;

      });
    return false;
  };

  BusEstimates(StartLat, StartLng, EndLat, EndLng){
    this.lat = StartLat.toString();
    this.lng = StartLng.toString();
    this.lat2 = EndLat.toString();
    this.lng2 = EndLng.toString();

    this.uberService.getUberTimes('http://localhost:3000/Bus/Bus?lat=' + this.lat + '&lng=' +this.lng + '&lat2='+this.lat2 +'&lng2='+this.lng2)
      .subscribe((busTimes) => {

        this.busTimes = busTimes;

      });
    return false;
  }
  dataPoints(StartLat, StartLng, EndLat, EndLng) {

    this.lat = StartLat.toString();
    this.lng = StartLng.toString();
    this.lat2 = EndLat.toString();
    this.lng2 = EndLng.toString();

    this.uberService.getUberTimes('http://localhost:3000/Uber/location?lat=' + this.lat + '&lng=' +this.lng + '&lat2='+this.lat2 +'&lng2='+this.lng2)
      .subscribe((times) => {

        this.times = times;

      });
    return false;
  }
}

interface Time{
  localized_display_name: string,
  estimate: number
}
