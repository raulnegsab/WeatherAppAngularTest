import { Injectable } from '@angular/core';
import { tabType } from './tabs/tabs.type';
import { ForecastCache, WeatherCondCache } from './weather.service';

type returnVal<T> = string | T[];

@Injectable({providedIn: 'root'})
export class CacheService {

    

  constructor() {
  
  }


setCache(label: string, data: string | ForecastCache[] | WeatherCondCache[] | string[]): void {

    localStorage.setItem(label, JSON.stringify({data: data}))

}


getCache(label:string): string | ForecastCache[] | WeatherCondCache[] | string[] {

    let returnValue: {data: string | ForecastCache[] | WeatherCondCache[] | string[]} = JSON.parse(localStorage.getItem(label))
    return returnValue?.data ?? null;
}

 
removeCache(label:string): void {
    localStorage.removeItem(label);
}



}


