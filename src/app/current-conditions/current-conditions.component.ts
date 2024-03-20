import {Component, inject, OnInit, Signal, TemplateRef, ViewChild} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { tab, tabType } from 'app/tabs/tabs.type';
import { TabFamilyDirective } from 'app/tabs/tab-family.directive';

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

         
            
          });
 
  }

  ngOnInit(): void {
    this.locationService.checkCachedLocations();
  }


  RemoveLogic(id: string) {
    console.log("run")
    this.locationService.removeLocation(id);
  }

 


 


}
