import {Component, inject, Signal} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { tab } from 'app/tabs/tabs.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent  {

  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  protected tabs: tab[] = [{id: '00999', title:"Check", innerHtml:"<div></div>", onRemove: this.RemoveLogic}, {id: '00988', title:"Check", innerHtml:"<div></div>", onRemove: this.RemoveLogic }]

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }

  constructor() {

    
    this.locationService.locations$.subscribe(zips => {
      




    });


  }


  RemoveLogic(tab: tab) {
    console.log(tab)
  }



 x: string = `<div (click)="showForecast(location.zip)>
  <h3>{{location.data.name}} ({{location.zip}})</h3>
  <h4>Current conditions: {{location.data.weather[0].main}}</h4>
  <h4>Temperatures today:</h4>
  <p>
    Current {{location.data.main.temp | number:'.0-0'}}
    - Max {{location.data.main.temp_max | number:'.0-0'}}
    - Min {{location.data.main.temp_min | number:'.0-0'}}
  </p>
  <p>
    <a [routerLink]="['/forecast', location.zip]" >Show 5-day forecast for {{location.data.name}}</a>
  </p>
</div>
<div>
  <img [src]="weatherService.getWeatherIcon(location.data.weather[0].id)">
</div>`



}
