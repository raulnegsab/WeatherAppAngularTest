import { Component, EventEmitter, Input, OnChanges, Output, Signal, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
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

  ngOnChanges(changes: SimpleChanges): void {
    
    if(this.tabs.length > 0 && this.selectedHTML == '' && this.selectedID == "") {
     // console.log("Here")
      this.selectedHTML = this.sanitizeHtml(this.tabs[0].innerHtml);
      this.selectedID = this.tabs[0].id;
    }
    
  }


  protected selectedHTML: SafeHtml = ""
  protected selectedID: string = ""
 

  constructor(private sanitizer: DomSanitizer) {
    
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

    //console.log("selected: " + tab.title)
    this.selectedID = tab.id
    this.selectedHTML = this.sanitizeHtml(tab.innerHtml)

  }

}


