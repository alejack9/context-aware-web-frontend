import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class UserCoordinatesGetterService {
  constructor() {}

  async getUserCoordinates(timeout = 5000, maximumAge = 0): Promise<LatLng> {
    return new Promise((res, rej) => {
      if (!navigator.geolocation)
        rej('Geolocalization not supported in current browser.');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          res(new LatLng(pos.coords.latitude, pos.coords.longitude));
        },
        (_) => {
          rej();
        },
        {
          enableHighAccuracy: true,
          timeout,
          maximumAge,
        }
      );
    });
  }
}
