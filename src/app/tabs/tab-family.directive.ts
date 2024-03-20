import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[tabItem]'
})
export class TabFamilyDirective {
  @Input() id: string;
  @Input() title: string;

}