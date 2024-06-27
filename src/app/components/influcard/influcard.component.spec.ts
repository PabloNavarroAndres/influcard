import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InflucardComponent } from './influcard.component';

describe('InflucardComponent', () => {
  let component: InflucardComponent;
  let fixture: ComponentFixture<InflucardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InflucardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InflucardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
