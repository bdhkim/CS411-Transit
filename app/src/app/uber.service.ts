import { Injectable } from '@angular/core'
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UberService {

  constructor(private http: Http) { }

  getUberTimes(link:string)
  {
    return this.http.get(link).map(res => res.json());
  }
}


