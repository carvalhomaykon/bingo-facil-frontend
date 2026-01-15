import { TestBed } from '@angular/core/testing';

import { TemplateCardService } from './template-card.service';

describe('TemplateCardService', () => {
  let service: TemplateCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
