import { TestBed, inject } from '@angular/core/testing';

import { AwsIotService } from './aws-iot.service';

describe('AwsIotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AwsIotService]
    });
  });

  it('should be created', inject([AwsIotService], (service: AwsIotService) => {
    expect(service).toBeTruthy();
  }));
});
