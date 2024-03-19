import {Injectable, Signal, signal} from '@angular/core';
import {Observable, of} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

export const CONDITIONS : string = "conditions";
export const FORECASTS : string = "forecasts";

@Injectable()
export class WeatherService {

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);
  public currentData = toObservable(this.currentConditions)

  cacheTime: number =  this.minutesOrSeconds('minutes', 120); //2 hours  this.minutesOrSeconds('seconds', 30)


  constructor(private http: HttpClient, 
              private locService: LocationService,
              private cacheService: CacheService) { 
    

    locService.locations$.subscribe(zips => {
      this.currentConditions.set([]);
      zips.forEach(loc => this.addCurrentConditions(loc));
    });

  }

  addCurrentConditions(zipcode: string): void {

    //cache check
    let LocationCache = this.cacheService.getCache(CONDITIONS);
    let condData = LocationCache?.data ? LocationCache.data : [];
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

    //if cached and not expired then dont run http request
    if(exists && validationTime > new Date() ) {
      this.currentConditions.update(conditions => { return [...conditions, {...conditionReturn}]  } )
    }

    else {

    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
      .subscribe(data => this.currentConditions.update(conditions => {

        //update cache   
        let newConditionData = condData.filter((v:any) => v.condition.zip != zipcode);                                                                                                    //2 hours 
        newConditionData.push({ condition: {zip: zipcode, data}, validThru: new Date(new Date().getTime() + this.cacheTime) } )
        this.cacheService.setCache(CONDITIONS, newConditionData);

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

    //cache check
    let cache = this.cacheService.getCache(FORECASTS);
    let forecastData = cache?.data ? cache.data : [];
    let exists: boolean = false;
    let forecastReturn: Forecast;
    let validationTime = null;

    forecastData.forEach((v:any) => {

      if(v.zip == zipcode) {
        exists = true

        forecastReturn = v.forecast;
        validationTime = new Date(v.validThru);
        
      }

    }); 

    //if cached and not expired then dont run http request
    if(exists && validationTime > new Date() ) {


      let observe: Observable<Forecast> = of(forecastReturn)

      return observe;
    }
    else {
   
      // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
      return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`).pipe(
        tap(data => {

        //cache clean and update
        let newForecastData = forecastData.filter((v:any) => v.zip != zipcode);
        newForecastData.push({zip: zipcode, forecast: data, validThru: new Date(new Date().getTime() + this.cacheTime) })
        this.cacheService.setCache(FORECASTS, newForecastData)
        

              })

      )
    }



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



  //used to customize how much time will be set 
  //from the current time for use as the expiration time of the cached data.
  minutesOrSeconds(type: string, amount: number): number {

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



