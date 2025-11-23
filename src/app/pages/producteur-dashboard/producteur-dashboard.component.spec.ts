import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducteurDashboardComponent } from './producteur-dashboard.component';

describe('ProducteurDashboardComponent', () => {
  let component: ProducteurDashboardComponent;
  let fixture: ComponentFixture<ProducteurDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducteurDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProducteurDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
