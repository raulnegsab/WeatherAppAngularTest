import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheService } from './cache.service';

export const LOCATIONS : string = "locations";

@Injectable({providedIn: 'root'})
export class LocationService {


 private locations = new BehaviorSubject<string[]>([]);
 get locations$(): Observable<string[]> { return this.locations.asObservable() } 
  
  constructor(private cacheService: CacheService) {
  
  }



  addLocation(zipcode : string) {

    var x: string[] = []

    this.locations.subscribe(v => {x = [...v]})

    if(x.includes(zipcode))
        return;

    //update cache
    this.cacheService.setCache(LOCATIONS, [...x, zipcode])

    this.locations.next([...x, zipcode]);

   


   
    
  }

  removeLocation(zipcode : string) {

    var x:string[] = []

    this.locations.subscribe(v => {x = [...v]})

    let index = x.indexOf(zipcode);
    var zipcodeList: string[] = [...x]
    if (index !== -1){
      zipcodeList.splice(index, 1);
      this.locations.next(zipcodeList)

      //update cache
      this.cacheService.setCache(LOCATIONS, zipcodeList);
     
    }
  }

 
checkCachedLocations() {
  let locationCache = this.cacheService.getCache(LOCATIONS) as string[]
  if(locationCache.length > 0) {
    this.locations.next(locationCache);
  }
}


}
