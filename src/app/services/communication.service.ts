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
    northEast: LatLng
  ): Promise<FeatureCollection<Point>> {
    let header = new HttpHeaders().set('Access-Control-Allow-Origin', '*');

    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat);

    return await this.http
      .get<FeatureCollection<Point>>(
        environment.apiUrl + 'locations/samplesInArea',
        {
          headers: header,
          params: params,
        }
      )
      .toPromise();
  }

  async getKmeansInArea(
    southWest: LatLng,
    northEast: LatLng,
    k = 4
  ): Promise<[any]> {
    let header = new HttpHeaders().set('Access-Control-Allow-Origin', '*');

    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat)
      .set('k', k);

    return await this.http
      .get<[any]>(environment.apiUrl + 'locations/kmeansInArea', {
        headers: header,
        params: params,
      })
      .toPromise();
  }
}
