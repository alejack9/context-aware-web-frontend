import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection, Point } from 'geojson';
import { LatLng } from 'leaflet';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  constructor(private http: HttpClient) {}

  async sendPing() {
    return await this.http
      .get(environment.apiUrl + 'ping', { responseType: 'text' })
      .toPromise();
  }

  async getSamplesInArea(
    southWest: LatLng,
    northEast: LatLng,
    dummyUpdates: boolean,
    gpsPerturbated: boolean,
    dummyUpdatesMinRadius: number,
    dummyUpdatesMaxRadius: number,
    gpsPerturbatedDecimals: number
  ): Promise<FeatureCollection<Point>> {
    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat)
      .set('dummyUpdates', dummyUpdates)
      .set('gpsPerturbated', gpsPerturbated)
      .set('minRadius', dummyUpdatesMinRadius)
      .set('maxRadius', dummyUpdatesMaxRadius)
      .set('pertDecimals', gpsPerturbatedDecimals);

    return await this.http
      .get<FeatureCollection<Point>>(
        environment.apiUrl + 'locations/samplesInArea',
        {
          params: params,
        }
      )
      .toPromise();
  }

  async getKmeansInArea(
    southWest: LatLng,
    northEast: LatLng,
    dummyUpdates: boolean,
    gpsPerturbated: boolean,
    dummyUpdatesMinRadius: number,
    dummyUpdatesMaxRadius: number,
    gpsPerturbatedDecimals: number,
    k: number
  ): Promise<FeatureCollection<Point>> {
    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat)
      .set('dummyUpdates', dummyUpdates)
      .set('gpsPerturbated', gpsPerturbated)
      .set('minRadius', dummyUpdatesMinRadius)
      .set('maxRadius', dummyUpdatesMaxRadius)
      .set('pertDecimals', gpsPerturbatedDecimals)
      .set('k', k);

    return await this.http
      .get<FeatureCollection<Point>>(
        environment.apiUrl + 'locations/kmeansInArea',
        {
          params: params,
        }
      )
      .toPromise();
  }
}
