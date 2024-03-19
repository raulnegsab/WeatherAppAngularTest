import { Component, Input } from '@angular/core';
import { tabType } from 'app/tabs/tabs.type';

@Component({
  selector: 'app-tab-templates',
  templateUrl: './tab-templates.component.html',
  styleUrl: './tab-templates.component.css'
})
export class TabTemplatesComponent {

  @Input() tabData: any;
  @Input() tabType: tabType;

  tabTypeEnum = tabType

}
