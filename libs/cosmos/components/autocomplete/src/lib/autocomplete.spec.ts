import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosAutocompleteComponent } from './autocomplete.component';
import { CosAutocompleteModule } from './autocomplete.module';
/**
 * TODO: test both "search" and "select" component modes
 */

describe('CosAutocompleteComponent', () => {
  let loader: HarnessLoader;
  let spectator: SpectatorHost<CosAutocompleteComponent>;

  const createHost = createHostFactory({
    component: CosAutocompleteComponent,
    imports: [CosAutocompleteModule],
  });

  describe('with array of strings', () => {
    beforeEach(() => {
      spectator = createHost(
        `
    <div>
      <cos-autocomplete [data]="data">
        <ng-template let-option>
          <div>{{ option }}</div>
        </ng-template>
      </cos-autocomplete>
    </div>`,
        {
          hostProps: {
            data: ['One', 'Two', 'Three'],
          },
        }
      );
      loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    });

    it('should open panel when input is focused', async () => {
      // Arrange
      const auto = await loader.getHarness(MatAutocompleteHarness);

      // Act
      await auto.focus();

      // Assert
      expect(await auto.isOpen()).toBe(true);
    });

    it('should default filter by text matching', async () => {
      // Arrange
      const auto = await loader.getHarness(MatAutocompleteHarness);

      // Act
      await auto.enterText('T');

      // Assert
      expect(await auto.isOpen()).toBe(true);
      expect((await auto.getOptions()).length).toBe(2);
    });

    it('should select option', async () => {
      // Arrange
      const auto = await loader.getHarness(MatAutocompleteHarness);

      // Act
      await auto.selectOption({ text: 'Three' });

      // Assert
      expect(await auto.getValue()).toBe('Three');
    });
  });

  describe('with array of objects', () => {
    const OPTIONS_DATA = [
      { person: 'One', type: 'Cat' },
      { person: 'Two', type: 'Cat' },
      { person: 'Three', type: 'Dog' },
    ];

    beforeEach(() => {
      spectator = createHost(
        `
    <div>
      <cos-autocomplete [valueSelector]="prop" [data]="data">
        <ng-template let-option>
          <div>{{ option.person }} - {{ option.type }}</div>
        </ng-template>
      </cos-autocomplete>
    </div>`,
        {
          hostProps: {
            prop: 'person',
            data: OPTIONS_DATA,
          },
        }
      );
      loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    });

    it('should default filter the data on the given valueSelector input', async () => {
      // Arrange
      const auto = await loader.getHarness(MatAutocompleteHarness);

      // Act
      await auto.enterText('T');

      // Assert
      expect(await auto.isOpen()).toBe(true);
      expect((await auto.getOptions()).length).toBe(2);
    });

    it('should fill input with selected option', async () => {
      // Arrange
      const auto = await loader.getHarness(MatAutocompleteHarness);

      // Act
      await auto.selectOption({
        text: 'Three - Dog',
      });

      // Assert
      expect(await auto.getValue()).toBe('Three');
    });
  });

  describe('with custom filterFn', () => {
    beforeEach(() => {
      spectator = createHost(
        `
    <div>
      <cos-autocomplete [filterFn]="filterFn" [data]="data">
        <ng-template let-option>
          <div>{{ option }}</div>
        </ng-template>
      </cos-autocomplete>
    </div>`,
        {
          hostProps: {
            data: ['One', 'Two', 'Three'],
            filterFn: (raw: any, datum: any, searchTerm: any) =>
              datum.includes(searchTerm.substring(4)),
          },
        }
      );
      loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    });

    it('should filter options using given filteFn input', async () => {
      // Arrange
      const auto = await loader.getHarness(MatAutocompleteHarness);

      // Act
      await auto.enterText('ThreOn');

      // Assert
      expect(await auto.isOpen()).toBe(true);

      const opts = await auto.getOptions({ text: 'One' });
      expect(opts.length).toBe(1);
    });

    it("User should be able to remove the search text using 'x' form search text box", async () => {
      const auto = await loader.getHarness(MatAutocompleteHarness);

      await auto.enterText('ThreOn');

      expect(await auto.isOpen()).toBe(true);
      const crossButton = spectator.query('button.cos-icon-button');
      expect(crossButton).toExist();
      expect(spectator.component.searchControl.value).toBe('ThreOn');
      spectator.click(crossButton!);
      spectator.detectChanges();
      expect(spectator.component.searchControl.value).toBe('');
    });
    it('Filtered list should appear as soon as clicked in checked', async () => {
      const auto = await loader.getHarness(MatAutocompleteHarness);
      await auto.focus();

      expect(await auto.isOpen()).toBe(true);
      const opts = await auto.getOptions();
      expect(opts.length).toBe(3);
    });
  });
});
