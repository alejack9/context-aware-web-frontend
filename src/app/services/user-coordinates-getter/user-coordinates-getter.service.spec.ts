import { TestBed } from '@angular/core/testing';

import { UserCoordinatesGetterService } from './user-coordinates-getter.service';

describe('UserCoordinatesGetterService', () => {
  let service: UserCoordinatesGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCoordinatesGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
