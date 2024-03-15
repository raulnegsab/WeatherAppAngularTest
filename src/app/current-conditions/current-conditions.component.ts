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

  
    
  
        
        
          this.weatherService.currentData.subscribe(loc => {

            this.tabs = []
            loc.forEach(val => {
              var tab: tab = {id: val.zip, title: val.data.name.replace(/"/g, ''), innerHtml: this.prepareDataExample(val), onRemove: this.RemoveLogic.bind(this)}; 
              this.tabs.push(tab);
            })

            console.log(this.tabs)

            
          
          })

       

          
  }


  RemoveLogic(tab: tab) {
    console.log(tab)
    this.locationService.removeLocation(tab.id);
  }

prepareDataExample(location: ConditionsAndZip): string {

  var url = this.weatherService.getWeatherIcon(location.data.weather[0].id)

  var template: string = `<div class="well flex" (click)="showForecast('${location.zip.replace(/"/g, '')}')">
  <h3>${location.data.name} (${location.zip})</h3>
  <h4>Current conditions: ${location.data.weather[0].main}</h4>
  <h4>Temperatures today:</h4>
  <p>
    Current ${Math.round(location.data.main.temp).toString() }
    - Max ${Math.round(location.data.main.temp_max).toString() }
    - Min ${Math.round(location.data.main.temp_min).toString() }
  </p>
  <p>
    <a [routerLink]="['/forecast', '${location.zip}']" >Show 5-day forecast for ${location.data.name}</a>
  </p>
  <div>
  <img src="${url}">
</div>
</div>`
  return template;
}

 


}
