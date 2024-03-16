import {Injectable, Signal, signal} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { toObservable } from '@angular/core/rxjs-interop';

export const CONDITIONS : string = "conditions";

@Injectable()
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);
  public currentData = toObservable(this.currentConditions)


  constructor(private http: HttpClient, private locService: LocationService) { 
    

    locService.locations$.subscribe(zips => {
      this.currentConditions.set([]);
      zips.forEach(loc => this.addCurrentConditions(loc));
    });

  }

  addCurrentConditions(zipcode: string): void {

    //cache check
    let LocationCache = localStorage.getItem(CONDITIONS);
    let condData = LocationCache ? JSON.parse(LocationCache).data : [];
    let exists: boolean = false;
    let conditionReturn: ConditionsAndZip;
    let validationTime = null;

    condData.forEach((v:any) => {

      if(v.condition.zip == zipcode) {
        exists = true

        conditionReturn = v.condition;
        validationTime = new Date(v.validThru);
        
      }

    }); 

    //if cached then dont run http request
    if(exists && validationTime > new Date() ) {
      this.currentConditions.update(conditions => {


         return [...conditions, {...conditionReturn}] 
        
        } )
    }

    else {

    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
      .subscribe(data => this.currentConditions.update(conditions => {

        //update cache                                                                                                       //2 hours 
        condData.push({ condition: {zip: zipcode, data}, validThru: new Date(new Date().getTime() + this.minutesOrSeconds('minutes', 120)) } ) // this.minutesOrSeconds('seconds', 30)
        localStorage.setItem(CONDITIONS, JSON.stringify({ data: condData }));

         return [...conditions, {zip: zipcode, data}] 
        
        } ));


      }
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update(conditions => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode)
          conditions.splice(+i, 1);
      }
      return conditions;
    })



  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);

  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }




  minutesOrSeconds(type: string, amount: number) {

    if(type.toLowerCase() == 'minutes') {
      return amount * 60 * 1000
    }
    else if (type.toLowerCase() == 'seconds') {
        return amount * 1000
    }
    else {
      return 0;
    }


  }


}



