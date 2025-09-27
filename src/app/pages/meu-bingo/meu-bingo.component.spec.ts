import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuBingoComponent } from './meu-bingo.component';

describe('MeuBingoComponent', () => {
  let component: MeuBingoComponent;
  let fixture: ComponentFixture<MeuBingoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeuBingoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeuBingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
