/// <reference types="zone.js" />

import { getZoneUnPatchedApi } from './get-zone-unpatched-api';

describe('getZoneUnPatchedApi', () => {
  it('should get the unpatched "addEventListener"', () => {
    // Arrange & act & assert
    expect(getZoneUnPatchedApi('addEventListener')).toBe(
      window[Zone.__symbol__('addEventListener') as 'addEventListener']
    );
  });

  it('should get the original API from window', () => {
    // Arrange & act & assert
    expect(getZoneUnPatchedApi('location')).toBe(window.location);
  });

  it('should get the original API from the element', () => {
    // Arrange & act & assert
    expect(getZoneUnPatchedApi(document.head, 'appendChild')).toEqual(
      document.head.appendChild
    );
  });

  it('should get unpatched API from the element', () => {
    // Arrange & act & assert
    expect(getZoneUnPatchedApi(document.head, 'addEventListener')).toEqual(
      document.head[Zone.__symbol__('addEventListener') as 'addEventListener']
    );
  });

  it('should add the event listener through the unpatched API', () => {
    // Arrange
    const listener = jest.fn();
    const event = new Event('message');
    const addEventListener = getZoneUnPatchedApi('addEventListener');
    const removeEventListener = getZoneUnPatchedApi('removeEventListener');

    // Act
    addEventListener.call(window, 'message', listener);
    window.dispatchEvent(event);
    removeEventListener.call(window, 'message', listener);

    // Assert
    expect(listener).toHaveBeenCalledWith(event);
  });
});
