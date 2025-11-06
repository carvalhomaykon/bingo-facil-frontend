import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDatailComponent } from './card-datail.component';

describe('CardDatailComponent', () => {
  let component: CardDatailComponent;
  let fixture: ComponentFixture<CardDatailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDatailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardDatailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
