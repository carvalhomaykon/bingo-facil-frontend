import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardModalComponent } from './award-modal.component';

describe('AwardModalComponent', () => {
  let component: AwardModalComponent;
  let fixture: ComponentFixture<AwardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AwardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
