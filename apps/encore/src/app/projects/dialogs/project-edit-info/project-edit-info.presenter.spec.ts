import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ProjectEditInfoPresenter } from './project-edit-info.presenter';

const testProject = {
  Id: 1,
  Customer: {},
  CreateDate: new Date(2021, 11, 11),
};

describe('ProjectEditInfoPresenter', () => {
  let spectator: SpectatorService<ProjectEditInfoPresenter>;

  const createService = createServiceFactory({
    service: ProjectEditInfoPresenter,
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  describe('parseToProject', () => {
    it('should remove "" from result', () => {
      const input = {
        Name: '',
        Budget: '',
        NumberOfAssignees: '',
        EventType: 'test',
      };

      expect(
        spectator.service.parseToProject(input as any, testProject as any)
      ).toEqual({
        ...testProject,
        Name: null,
        EventType: 'test',
        Budget: null,
        NumberOfAssignees: null,
      });
    });

    it('should parse string to budget', () => {
      const input = {
        Name: '',
        Budget: '100.50',
        NumberOfAssignees: '',
        EventType: 'test',
      };

      expect(
        spectator.service.parseToProject(input as any, testProject as any)
      ).toEqual({
        ...testProject,
        Name: null,
        EventType: 'test',
        Budget: 100.5,
        NumberOfAssignees: null,
      });
    });

    it('should parse string to number of assignees', () => {
      const input = {
        Name: '',
        Budget: '',
        NumberOfAssignees: '10',
        EventType: 'test',
      };

      expect(
        spectator.service.parseToProject(input as any, testProject as any)
      ).toEqual({
        ...testProject,
        Name: null,
        EventType: 'test',
        Budget: null,
        NumberOfAssignees: 10,
      });
    });
  });
});
