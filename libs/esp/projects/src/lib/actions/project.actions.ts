import { AfterSuccess } from '@cosmos/state';
import { Project } from '@esp/models';
import { ProjectClosePayload } from '../models';
import { ProjectsRecentActions } from './projects-recent.actions';

const ACTION_SCOPE = '[Projects]';

export namespace ProjectActions {
  @AfterSuccess(ProjectsRecentActions.Load)
  export class CloseProject {
    static readonly type = `${ACTION_SCOPE} CloseProject`;

    constructor(public readonly payload: ProjectClosePayload) {}
  }

  @AfterSuccess(ProjectsRecentActions.Load)
  export class CreateProject {
    static readonly type = `${ACTION_SCOPE} CreateProject`;

    constructor(
      public readonly project: Project,
      public readonly productIds: number[]
    ) {}
  }

  @AfterSuccess(ProjectsRecentActions.Load)
  export class Get {
    static readonly type = `${ACTION_SCOPE} Get`;

    constructor(public readonly id: number) {}
  }

  @AfterSuccess(ProjectsRecentActions.Load)
  export class Patch {
    static readonly type = `${ACTION_SCOPE} Patch`;

    constructor(public readonly payload: Partial<Project>) {}
  }

  @AfterSuccess(ProjectsRecentActions.Load)
  export class ReopenProject {
    static readonly type = `${ACTION_SCOPE} ReopenProject`;

    constructor(public readonly project: Project) {}
  }

  @AfterSuccess(ProjectsRecentActions.Load)
  export class Update {
    static readonly type = `${ACTION_SCOPE} Update`;

    constructor(public readonly payload: Project) {}
  }

  @AfterSuccess(ProjectsRecentActions.Load)
  export class TransferOwner {
    static readonly type = `${ACTION_SCOPE} Transfer owner`;

    constructor(
      public readonly payload: Project,
      public readonly ownerId: number
    ) {}
  }
}
