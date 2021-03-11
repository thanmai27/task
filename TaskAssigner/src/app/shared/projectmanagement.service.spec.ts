import { TestBed } from '@angular/core/testing';

import { ProjectmanagementService } from './projectmanagement.service';

describe('ProjectmanagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectmanagementService = TestBed.get(ProjectmanagementService);
    expect(service).toBeTruthy();
  });
});
