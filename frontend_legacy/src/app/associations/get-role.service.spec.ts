import { TestBed } from '@angular/core/testing';

import { GetRoleService } from './get-role.service';

describe('GetRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetRoleService = TestBed.get(GetRoleService);
    expect(service).toBeTruthy();
  });
});
