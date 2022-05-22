import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service;
  let spectator: SpectatorService<TasksService>;
  const createService = createServiceFactory({
    service: TasksService,
    imports: [HttpClientTestingModule],
    providers: [TasksService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generate', () => {
    it('should return a task', () => {
      const task = service.generate();

      expect(task).toBeTruthy();
    });
  });

  describe('toSearchModel', () => {
    it('should return tasksearch', () => {
      const task = service.generate();

      const search = service.toSearchModel(task);

      expect(search).toBeTruthy();
    });

    it('should work without task.Notes', () => {
      const task = service.generate();

      delete task.Notes;
      const search = service.toSearchModel(task);

      expect(search).toBeTruthy();
    });

    it('should set note', () => {
      const task = service.generate();

      task.Notes.push({});

      const search = service.toSearchModel(task);

      expect(search).toBeTruthy();
    });
  });
});
