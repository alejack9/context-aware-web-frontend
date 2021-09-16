export interface Sample {
  id: number;
  timestamp: any;
  location: {
    type: string;
    coordinates: [number, number];
  };
  noise: number;
}
