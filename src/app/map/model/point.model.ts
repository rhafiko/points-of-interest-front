export class Point {
  id: string;
  lat: string;
  lng: string;
  title: string;

  constructor(lat?: string, lng?: string, title?: string, id?: string) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.title = title;
  }
}
