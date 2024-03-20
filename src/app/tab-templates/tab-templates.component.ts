import { Component, Input, OnInit } from '@angular/core';
import { tabType } from 'app/tabs/tabs.type';
import { CacheService } from 'app/cache.service';
import { SELECTEDTAB } from 'app/tabs/tabs.component';

@Component({
  selector: 'tab-item',
  templateUrl: './tab-templates.component.html',
  styleUrl: './tab-templates.component.css'
})
export class TabTemplatesComponent implements OnInit {

  @Input() id: string;
  @Input() title: string;
  @Input() remove?: (id:string) => void;
  isActive: boolean = false;

  constructor(private cacheService: CacheService) {
    
  }

  ngOnInit() {
    let cache: string = this.cacheService.getCache(SELECTEDTAB) as string ?? null

    if(this.id == cache && cache != null) {
        this.isActive = true;
    }
  }


}
