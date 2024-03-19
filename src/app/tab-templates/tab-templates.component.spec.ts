import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabTemplatesComponent } from './tab-templates.component';

describe('TabTemplatesComponent', () => {
  let component: TabTemplatesComponent;
  let fixture: ComponentFixture<TabTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabTemplatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
