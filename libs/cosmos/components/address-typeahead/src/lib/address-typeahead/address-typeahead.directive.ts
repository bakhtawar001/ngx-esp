/// <reference types="googlemaps" />
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { defer, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Address } from '@esp/models';

declare global {
  interface Window {
    __googleMapsCallback(): void;
  }
}

const googleMaps$ = defer(
  () =>
    new Observable<void>((observer) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyD-_ZnBaTkvJff6je2jJV8VExot1hHCSQw&libraries=places&callback=__googleMapsCallback';
      document.head.appendChild(script);
      window.__googleMapsCallback = () => {
        observer.next();
        observer.complete();
      };
      const onError = observer.error.bind(observer);
      script.addEventListener('error', onError);
      return () => {
        script.removeEventListener('error', onError);
      };
    })
).pipe(shareReplay({ bufferSize: 1, refCount: true }));

@UntilDestroy()
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cos-address-typeahead]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-address-typeahead',
  },
})
export class AddressTypeaheadDirective implements OnInit, OnDestroy {
  @Input()
  options = {
    types: ['address'],
  };

  @Output()
  addressChanged = new EventEmitter<Address>();

  @HostBinding('autocomplete')
  autocomplete = 'off';

  private placeChangedListener: google.maps.MapsEventListener | null = null;

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    googleMaps$.pipe(untilDestroyed(this)).subscribe(() => {
      this.createAutocomplete();
    });
  }

  ngOnDestroy(): void {
    this.placeChangedListener?.remove();
  }

  private createAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(
      this.elementRef.nativeElement,
      this.options
    );
    this.placeChangedListener = autocomplete.addListener(
      'place_changed',
      () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry == null) {
            return;
          }

          const address: Address = {
            Id: 0,
            Line1: '',
            City: '',
            State: '',
            County: '',
            Country: '',
            CountryType: '',
            PostalCode: '',
          };

          place.address_components!.forEach((component) => {
            if (component.types.includes('street_number')) {
              address.Line1 = component.short_name;
            } else if (component.types.includes('route')) {
              address.Line1 += address.Line1
                ? ' ' + component.short_name
                : component.short_name;
            } else if (component.types.includes('locality')) {
              address.City = component.short_name;
            } else if (component.types.includes('neighborhood')) {
              address.City = component.short_name;
            } else if (
              component.types.includes('administrative_area_level_1')
            ) {
              address.State = component.short_name;
            } else if (
              component.types.includes('administrative_area_level_2')
            ) {
              address.County = component.long_name;
            } else if (component.types.includes('country')) {
              address.Country = component.long_name;
              address.CountryType = component.short_name;
            } else if (component.types.includes('postal_code')) {
              address.PostalCode = component.short_name;
            } else if (component.types.includes('postal_code_suffix')) {
              address.PostalCode += '-' + component.short_name;
            }
          });
          this.addressChanged.emit(address);
        });
      }
    );
  }
}
