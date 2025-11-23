import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducteurComponent } from './producteur.component';

describe('ProducteurComponent', () => {
  let component: ProducteurComponent;
  let fixture: ComponentFixture<ProducteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducteurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProducteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
