import { Injectable } from '@angular/core';
import {WeatherService} from "./weather.service";
import { BehaviorSubject, Observable } from 'rxjs';

export const LOCATIONS : string = "locations";

@Injectable({providedIn: 'root'})
export class LocationService {

 // locations : string[] = [];

 private locations = new BehaviorSubject<string[]>([]);

 
 get locations$(): Observable<string[]> { return this.locations.asObservable() } 
  


  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.locations.next(JSON.parse(locString));
  }



  addLocation(zipcode : string) {

    var x: string[] = []

    this.locations.subscribe(v => {x = [...v]})

    if(x.includes(zipcode))
        return;

    this.locations.next([...x, zipcode]);
   // localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    
  }

  removeLocation(zipcode : string) {

    var x = []

    this.locations.subscribe(v => {x = [...v]})

   // this.locations.next([...x, zipcode]);

    let index = x.indexOf(zipcode);
    var zipcodeList = [...x]
    if (index !== -1){
      zipcodeList.splice(index, 1);
      this.locations.next(zipcodeList)
    //  localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
     
    }
  }

 



}
