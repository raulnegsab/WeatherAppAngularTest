import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Signal, SimpleChanges, inject } from '@angular/core';
import { tab, tabType } from './tabs.type';
import { CacheService } from 'app/cache.service';

export const SELECTEDTAB = 'SelectedTabId'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements OnInit, OnChanges  {

  @Input() tabs: tab[];
  @Output() tabsChange: EventEmitter<tab[]> = new EventEmitter();

  protected selectedTab: tabType = null
  protected selectedID: string = ""
  protected tabData: any;

   TabType = tabType;
   

  constructor(private cacheService: CacheService) {
    
  }

  ngOnInit(): void {
    
    //check cache for selected tab
    let cache = this.cacheService.getCache(SELECTEDTAB);

    if(cache?.data) {
      
          this.selectedTab = cache.data.tabType;
          this.selectedID = cache.data.id;

    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    
    //if the selected tab gets removed set the first tab in the array as the selected tab
    if(this.tabs.length > 0 && this.selectedTab == null && this.selectedID == "") {
      this.selectedTab = this.tabs[0].tabType;
      this.selectedID = this.tabs[0].id;
      this.tabData = this.tabs[0].tabData;

    }

    if(this.tabs.length > 0 && this.selectedTab != null && this.selectedID != "" && this.tabData == null) {
      this.tabs.forEach(tab => {
            if(tab.id == this.selectedID)
              this.tabData = tab.tabData
      })
    }

   // console.log(this.tabData)
    
  }


  trackById(index: number, item: tab): string {
    return item.id;
  }


  handleRemove(tab: tab) {

    var newTabs = this.tabs.filter(v => v.id != tab.id);

    if(tab.id == this.selectedID) {
        this.selectedID = ''
        this.selectedTab = null
        this.tabData = null
    }

    this.tabsChange.emit(newTabs);

    if (typeof tab.onRemove === "function") {
      tab.onRemove(tab);
    }


  }

  handleSelect(tab: tab) {
    if(tab.id == this.selectedID) 
    return;

    this.selectedID = tab.id
    this.selectedTab = tab.tabType
    this.tabData = tab.tabData

    this.cacheService.setCache(SELECTEDTAB, {id: tab.id, tabType: tab.tabType, tabData: tab.tabData})

  }

}


