import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InflucardDetallesComponent } from './influcard-detalles.component';

describe('InflucardDetallesComponent', () => {
  let component: InflucardDetallesComponent;
  let fixture: ComponentFixture<InflucardDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InflucardDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InflucardDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
