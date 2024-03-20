import { ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, OnChanges, Output,  QueryList,  SimpleChanges } from '@angular/core';
import { tab, tabType } from './tabs.type';
import { CacheService } from 'app/cache.service';
import { TabFamilyDirective } from './tab-family.directive';
import { TabTemplatesComponent } from 'app/tab-templates/tab-templates.component';
export const SELECTEDTAB = 'SelectedTabId'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements OnChanges  {

  tabs: tab[] = [];
 

  protected selectedTab: tabType = null
  protected selectedID: string = ""

   TabType = tabType;

   @ContentChildren(TabTemplatesComponent, { descendants: true }) contentChildren!: QueryList<TabTemplatesComponent>;

 

  ngAfterContentInit() {
    // Now you can access the projected content's attributes via the directives
   
    this.contentChildren.forEach((children) => {

     // console.log(children)

     let cache = this.cacheService.getCache(SELECTEDTAB) as string;
    
    if(cache != null) {
      this.selectedID = cache;
     
    }

     this.tabs.push({id: children.id, title: children.title, onTabRemove: children.remove} as tab)

    
    });

    

    this.contentChildren.changes.subscribe((items: QueryList<TabTemplatesComponent>) => {
      // Handle the updated list items here
      let newTabs: tab[] =[]
      let activeId: string = ''
      items.forEach((children) => {
       
       newTabs.push({id: children.id, title: children.title, onTabRemove: children.remove} as tab)
      });

      let cache = this.cacheService.getCache(SELECTEDTAB) as string;
    
    if(cache != null) {
      this.selectedID = cache;
     
    }

      this.tabs = [...newTabs]

    });
  }
   

  constructor(private cacheService: CacheService, private cdr: ChangeDetectorRef) {
     
   
  }

  ngOnChanges(changes: SimpleChanges): void {
 
  
    
  }


  trackById(index: number, item: tab): string {
    return item.id;
  }


  handleRemove(tab: tab) {

    var newTabs = this.tabs.filter(v => v.id != tab.id);

    if(tab.id == this.selectedID) {
        this.selectedID = ''
        this.cacheService.removeCache(SELECTEDTAB);
    }

    // if(this.tabs.length > 0 && this.selectedID == "") {
    //   this.selectedID = this.tabs[0].id;
    //   this.cacheService.setCache(SELECTEDTAB, this.tabs[0].id)
      
    // }


    if (typeof tab.onTabRemove === "function") {
      tab.onTabRemove(tab.id);
    }

    if(newTabs.length == 0) {
        this.cacheService.removeCache(SELECTEDTAB);
    }

    this.tabs = [...newTabs];

    


  }

  handleSelect(tab: tab) {
    if(tab.id == this.selectedID) 
    return;

    this.setActiveTab(tab.id)

    this.selectedID = tab.id
    //this.selectedTab = tab.tabType
    this.cacheService.setCache(SELECTEDTAB, tab.id as string);
   

  }


  setActiveTab(id: string): void {
    this.contentChildren.forEach((children) => {
      // React to changes

         if(id == children.id) {
            children.isActive = true;
         }
         else {
          children.isActive = false;
         }
    });
  }

}


