import { NgxsSelectorTestBed } from '@cosmos/testing';
import { LookupTypeKey } from '../models';
import { allLookupStateProperties, LookupTypesState } from '../states';
import {
  createLookup,
  createLookupTypesStateModel,
  createOrderStatus,
  createTagType,
} from '../testing';
import { LookupTypeQueries } from './lookup-type.queries';

describe('LookupTypeQueries', () => {
  describe(`.lookups`, () => {
    describe(`.TagTypes`, () => {
      it('should return TagTypes from the state', () => {
        // Arrange
        const sampleTagType = createTagType();
        const state = createLookupTypesStateModel({
          lookups: {
            TagTypes: [sampleTagType],
          },
        });
        const selectorTestBed = new NgxsSelectorTestBed() //
          .setState(LookupTypesState, state);

        // Act
        const result = selectorTestBed.getSnapshot(
          LookupTypeQueries.lookups.TagTypes
        );
        // Assert
        expect(result).toEqual([sampleTagType]);
      });

      it('should return empty TagTypes when none exists in the state', () => {
        // Arrange
        const selectorTestBed = new NgxsSelectorTestBed() //
          .setState(LookupTypesState, createLookupTypesStateModel());

        // Act
        const result = selectorTestBed.getSnapshot(
          LookupTypeQueries.lookups.TagTypes
        );
        // Assert
        expect(result).toEqual([]);
      });
    });

    describe(`.OrderStatuses`, () => {
      it('should return OrderStatuses from the state', () => {
        // Arrange
        const sampleOrderStatus = createOrderStatus();
        const state = createLookupTypesStateModel({
          lookups: {
            OrderStatuses: [sampleOrderStatus],
          },
        });
        const selectorTestBed = new NgxsSelectorTestBed() //
          .setState(LookupTypesState, state);

        // Act
        const result = selectorTestBed.getSnapshot(
          LookupTypeQueries.lookups.OrderStatuses
        );
        // Assert
        expect(result).toEqual([sampleOrderStatus]);
      });

      it('should return empty OrderStatuses when none exists in the state', () => {
        // Arrange
        const selectorTestBed = new NgxsSelectorTestBed() //
          .setState(LookupTypesState, createLookupTypesStateModel());

        // Act
        const result = selectorTestBed.getSnapshot(
          LookupTypeQueries.lookups.OrderStatuses
        );
        // Assert
        expect(result).toEqual([]);
      });
    });

    const excludedCases: LookupTypeKey[] = ['OrderStatuses', 'TagTypes'];
    const testCases = allLookupStateProperties.filter(
      (key: LookupTypeKey) => !excludedCases.includes(key)
    );
    testCases.forEach((type) => {
      describe(`.${type}`, () => {
        it(`should return ${type} from the state`, () => {
          // Arrange
          const sampleLookup = createLookup();
          const state = createLookupTypesStateModel({
            lookups: {
              [type]: [sampleLookup],
            },
          });
          const selectorTestBed = new NgxsSelectorTestBed() //
            .setState(LookupTypesState, state);

          // Act
          const result = selectorTestBed.getSnapshot(
            LookupTypeQueries.lookups[type]
          );
          // Assert
          expect(result).toEqual([sampleLookup]);
        });

        it(`should return empty ${type} when none exists in the state`, () => {
          // Arrange
          const selectorTestBed = new NgxsSelectorTestBed() //
            .setState(LookupTypesState, createLookupTypesStateModel());

          // Act
          const result = selectorTestBed.getSnapshot(
            LookupTypeQueries.lookups[type]
          );
          // Assert
          expect(result).toEqual([]);
        });
      });
    });
  });
});
