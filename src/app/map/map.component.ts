import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Leaflet from 'leaflet';
import { MapService } from './services/map.service';
import { ActivatedRoute } from '@angular/router';
import { Point } from './model/point.model';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { HelperService } from './services/helper.service';
import { AuthService } from 'src/app/auth/auth.service';

let defaultIcon = new Leaflet.Icon({
  iconUrl: 'assets/images/marker-icon-2x-blue.png',
  shadowUrl: 'assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

let currentLocationIcon = new Leaflet.Icon({
  iconUrl: 'assets/images/marker-icon-2x-green.png',
  shadowUrl: 'assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public map;
  public displayMaintainPointDialog: boolean = false;
  public displaySharePointDialog: boolean = false;
  public urlToShare: any;
  public formLocation: FormGroup;
  public formSearchPoint: FormGroup;
  public errorMessage = [];
  public point: Point;
  public markerForUpdate;
  public markerCurrentLocation;
  public searchCriteria;

  constructor(
    private mapService: MapService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private helperService: HelperService,
    private authService: AuthService
  ) {
    this.point = new Point();
    this.formLocation = this.formBuilder.group({
      pointName: [this.point?.title, [Validators.required, Validators.minLength(4), Validators.maxLength(80)]],
    });

    this.formSearchPoint = this.formBuilder.group({
      searchCriteria: [this.searchCriteria, [Validators.minLength(4), Validators.maxLength(80)]],
    });
  }

  public ngOnInit(): void {
    this.initMap();
    this.getMyLocation();
    this.getAllPoints();

    let params = this.route.snapshot.queryParams;
    if (params['from']) {
      this.confirmationService.confirm({
        message: `<b>${params['from']}</b> has shared a new place: <b>"${params['title']}"</b><br/> Would you like to add it to your map ?`,
        accept: () => {
          let location = { lat: params['lat'], lng: params['lng'] };
          this.point = new Point(location.lat, location.lng, params['title']);
          this.createPoint().then(() => {
            this.moveCamera(location);
          });
        },
      });
    }
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [43.464569350207285, -80.52240371704103],
      zoom: 14,
    });

    this.map.on('click', (event) => {
      this.point = new Point(event.latlng.lat, event.latlng.lng);
      this.showAddPointDialog();
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
  }

  public getMyLocation() {
    if (this.markerCurrentLocation) {
      this.map.removeLayer(this.markerCurrentLocation);
    }

    this.helperService.getCurrentLocation().then((position) => {
      let currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      this.markerCurrentLocation = Leaflet.marker([currentLocation.lat, currentLocation.lng], {
        icon: currentLocationIcon,
      })
        .addTo(this.map)
        .bindPopup('My current location');
      this.moveCamera(currentLocation);
    });
  }

  private moveCamera(position) {
    this.map.setView([position.lat, position.lng], 14);
  }

  private showAddPointDialog() {
    if (!this.displayMaintainPointDialog) {
      this.errorMessage = [];
      this.formLocation.reset();
      console.log(this.point);
      this.displayMaintainPointDialog = true;
    }
  }

  private showEditPointDialog() {
    if (!this.displayMaintainPointDialog) {
      this.errorMessage = [];
      this.displayMaintainPointDialog = true;
    }
  }

  private addNewPointToMap(map, point: Point) {
    let marker = Leaflet.marker([point.lat, point.lng], { icon: defaultIcon }).addTo(map);
    marker.lat = point.lat;
    marker.lng = point.lng;
    marker.title = point.title;
    marker.id = point.id;

    let btnEdit = this.helperService.getEditButton(this.onClickEditPoint.bind(this, marker));
    let btnShare = this.helperService.getShareButton(this.onClickSharePoint.bind(this, marker));
    let btnRemove = this.helperService.getRemoveButton(this.onClickRemovePoint.bind(this, marker, map));

    marker.bindPopup(this.helperService.buildPopupHtml(point.title, btnRemove, btnEdit, btnShare), {
      maxWidth: 'auto',
    });
  }

  private onClickSharePoint(marker) {
    console.log(marker);
    this.urlToShare = {
      title: marker.title,
      url: `${location.origin}/map?lat=${marker.lat}&lng=${marker.lng}&title=${marker.title}&from=${this.authService.userData}`,
    };
    this.displaySharePointDialog = true;
  }

  private onClickRemovePoint(marker, map) {
    this.mapService.removePoint(marker.id).then(() => {
      console.log(marker);
      map.removeLayer(marker);
      this.messageService.add({
        severity: 'warn',
        summary: 'Point Removed',
        detail: `Your point "${marker.title.substring(0, 35)}" was removed`,
      });
    });
  }

  private onClickEditPoint(marker) {
    if (marker.id.length > 0) {
      this.getPointById(marker.id).then((point) => {
        this.point = point;
        this.markerForUpdate = marker;
        this.showEditPointDialog();
      });
    }
  }

  public maintainPoint() {
    this.errorMessage = [];

    if (this.formLocation.valid) {
      if (this.point.id) {
        this.updatePoint().then();
      } else {
        this.createPoint().then();
      }
    } else {
      this.errorMessage.push(`Point Name is required and must be longer than or equal to 4 characters.`);
    }
  }

  private updatePoint(): Promise<boolean> {
    return new Promise((resolve) => {
      this.mapService.updatePoint(this.point.id, this.point.title).then((data) => {
        this.displayMaintainPointDialog = false;

        this.map.removeLayer(this.markerForUpdate);
        let newMapPoint = new Point(this.point.lat, this.point.lng, this.point.title, data.id);
        this.addNewPointToMap(this.map, newMapPoint);

        this.messageService.add({
          severity: 'success',
          summary: 'Update Point',
          detail: `Your point "${this.point.title.substring(0, 35)}" was successfully updated `,
        });
        resolve(true);
      });
    });
  }

  private createPoint(): Promise<boolean> {
    return new Promise((resolve) => {
      this.mapService.createPoint(this.point.lat, this.point.lng, this.point.title).then((data) => {
        let newMapPoint = new Point(this.point.lat, this.point.lng, this.point.title, data.id);
        this.addNewPointToMap(this.map, newMapPoint);
        this.displayMaintainPointDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'New Point',
          detail: `Your new point "${this.point.title.substring(0, 35)}" was created`,
        });
        resolve(true);
      });
    });
  }

  private getPointById(id: string): Promise<Point> {
    return new Promise((resolve) => {
      this.mapService.getPoint(id).then((point) => {
        resolve(point);
      });
    });
  }

  searchPoints(ev: any) {
    this.map.off();
    this.map.remove();
    this.initMap();
    this.getMyLocation();
    this.getAllPoints();
  }

  private getAllPoints() {
    this.mapService.getPoints(this.searchCriteria).then((points) => {
      points.map((point) => {
        let newMapPoint = new Point(point.lat, point.lng, point.title, point.id);
        this.addNewPointToMap(this.map, newMapPoint);
        if (this.searchCriteria) {
          const currentLocation = { lat: point.lat, lng: point.lng };
          this.moveCamera(currentLocation);
        }
      });
      if (points.length == 0 && this.searchCriteria) {
        this.messageService.add({
          severity: 'info',
          summary: 'Search',
          detail: `No results found for the given Criteria: "${this.searchCriteria}"`,
        });
      }
    });
  }
}
