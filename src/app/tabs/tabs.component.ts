import { Component, EventEmitter, Input, OnInit, Output, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { tab } from './tabs.type';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements OnInit  {

  @Input() tabs: tab[];
  @Output() tabsChange: EventEmitter<tab[]> = new EventEmitter();

  ngOnInit(): void {
    console.log(this.tabs)
  }


  protected selectedHTML: SafeHtml = ""
  protected selectedZip: string = ""
 

  constructor(private sanitizer: DomSanitizer) {
    
  }

  SelectTab(selID: string) {
    this.tabs.forEach(tab => {
      if(tab.id == selID) {
        this.selectedZip = selID;
        this.selectedHTML = this.sanitizeHtml(tab.innerHtml);
      }
    })

  }


  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  trackById(index: number, item: tab): string {
    return item.id;
  }

  handleRemove(tab: tab) {

   

    var newTabs = this.tabs.filter(v => v.id != tab.id);

    this.tabsChange.emit(newTabs);

    if (typeof tab.onRemove === "function") {
      tab.onRemove(tab);
    }

    



  }

}


