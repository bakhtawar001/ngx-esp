import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosCardTreeChildComponent } from './card-tree.component';
import { CosCardTreeModule } from '../card-tree.module';

describe('CosCardTreeComponent', () => {
  let component: CosCardTreeChildComponent;
  let spectator: SpectatorHost<CosCardTreeChildComponent>;
  const createHost = createHostFactory({
    component: CosCardTreeChildComponent,
    imports: [CosCardTreeModule],
  });

  beforeEach(() => {
    spectator = createHost(`
      <cos-card-tree>
        <cos-card-tree-parent>Parent</cos-card-tree-parent>
        <cos-card-tree-child>Child</cos-card-tree-child>
      </cos-card-tree>
    `);
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.queryHost('.cos-card-tree-parent')).toBeTruthy();
    expect(spectator.queryHost('.cos-card-tree-child')).toBeTruthy();
  });
});
