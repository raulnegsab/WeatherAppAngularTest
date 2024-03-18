import { Component, EventEmitter, Input, OnChanges, Output, Signal, SimpleChanges, inject } from '@angular/core';
import { tab } from './tabs.type';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements OnChanges  {

  @Input() tabs: tab[];
  @Output() tabsChange: EventEmitter<tab[]> = new EventEmitter();

  protected selectedHTML: SafeHtml = ""
  protected selectedID: string = ""

 

 

  constructor(private sanitizer: DomSanitizer) {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    //if the selected tab gets removed set the first tab in the array as the selected tab
    if(this.tabs.length > 0 && this.selectedHTML == '' && this.selectedID == "") {
      this.selectedHTML = this.sanitizeHtml(this.tabs[0].innerHtml);
      this.selectedID = this.tabs[0].id;
    }
    
  }


  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  trackById(index: number, item: tab): string {
    return item.id;
  }


  handleRemove(tab: tab) {

    var newTabs = this.tabs.filter(v => v.id != tab.id);

    if(tab.id == this.selectedID) {
        this.selectedID = ''
        this.selectedHTML = ''
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
    this.selectedHTML = this.sanitizeHtml(tab.innerHtml)

  }

}


