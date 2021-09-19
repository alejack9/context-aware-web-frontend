import 'leaflet.heat/dist/leaflet-heat.js';
import * as L from 'leaflet';

type HeatLatLngTuple = [number, number, number];

interface ColorGradientConfig {
  [key: number]: string;
}

interface HeatMapOptions {
  minOpacity?: number | undefined;
  maxZoom?: number | undefined;
  max?: number | undefined;
  radius?: number | undefined;
  blur?: number | undefined;
  gradient?: ColorGradientConfig | undefined;
}

interface HeatLayer extends L.TileLayer {
  setOptions(options: HeatMapOptions): HeatLayer;
  addLatLng(latlng: L.LatLng | HeatLatLngTuple): HeatLayer;
  setLatLngs(latlngs: Array<L.LatLng | HeatLatLngTuple>): HeatLayer;
}

export function heatLayer(
  latlngs: Array<L.LatLng | HeatLatLngTuple>,
  options: HeatMapOptions
): HeatLayer {
  return (L as any).heatLayer(latlngs, options);
}
