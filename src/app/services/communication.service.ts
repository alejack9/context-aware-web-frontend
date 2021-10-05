import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection, Point } from 'geojson';
import { LatLng } from 'leaflet';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  constructor(private http: HttpClient) {}

  async getSamplesInArea(
    southWest: LatLng,
    northEast: LatLng,
    dummyUpdates: boolean,
    gpsPerturbated: boolean
  ): Promise<FeatureCollection<Point>> {
    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat)
      .set('dummyUpdates', dummyUpdates)
      .set('gpsPerturbated', gpsPerturbated);

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
    k: number
  ): Promise<FeatureCollection<Point>> {
    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat)
      .set('dummyUpdates', dummyUpdates)
      .set('gpsPerturbated', gpsPerturbated)
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
