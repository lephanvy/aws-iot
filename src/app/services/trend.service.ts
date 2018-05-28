import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class TrendService {

  constructor(
    private http: Http
  ) { }
  getTempers() :Observable<any>{

    let url ='http://temper.test/temper';

    return this.http.get(url).map((response: any) => response.json().result);
  }
}
