import {Component, inject, OnInit, Signal, TemplateRef, ViewChild} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { tab, tabType } from 'app/tabs/tabs.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit  {

  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  protected tabs: tab[] = [] //
  

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }

  constructor() {

          this.weatherService.currentData.subscribe(loc => {

            this.tabs = []
            loc.forEach(val => {                                                                                            //Code that will run when the tab is removed. Its not necessary for removing the tab.
              var tab: tab = {id: val.zip, title: val.data.name.replace(/"/g, ''), tabType: tabType.Conditions, onRemove: this.RemoveLogic.bind(this),
              tabData: {value: val, 
                icon: this.weatherService.getWeatherIcon(val.data.weather[0].id),
              showForecast: this.showForecast.bind(this)
              }
              
            }; 
              this.tabs.push(tab);
            })
            
          });
 
  }

  ngOnInit(): void {
    this.locationService.checkCachedLocations();
  }


  RemoveLogic(tab: tab) {
    this.locationService.removeLocation(tab.id);
  }


 


}
