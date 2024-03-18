import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const LOCATIONS : string = "locations";

@Injectable({providedIn: 'root'})
export class LocationService {


 private locations = new BehaviorSubject<string[]>([]);
 get locations$(): Observable<string[]> { return this.locations.asObservable() } 
  
  constructor() {
  
  }



  addLocation(zipcode : string) {

    var x: string[] = []

    this.locations.subscribe(v => {x = [...v]})

    if(x.includes(zipcode))
        return;

    this.locations.next([...x, zipcode]);
   
    
  }

  removeLocation(zipcode : string) {

    var x = []

    this.locations.subscribe(v => {x = [...v]})

    let index = x.indexOf(zipcode);
    var zipcodeList = [...x]
    if (index !== -1){
      zipcodeList.splice(index, 1);
      this.locations.next(zipcodeList)
     
    }
  }

 



}
