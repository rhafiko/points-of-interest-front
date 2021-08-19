import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MapService } from './map.service';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';

describe('MapService', () => {
  let service: MapService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  const mockPoints = [
    {
      id: 'bd9086de-65ff-4ecf-a015-26f52637aebb',
      lat: '-25.489614314365355',
      lng: '-49.26093578338623',
      title: 'Mock Place 01',
    },
    {
      id: '4110786a-57cc-42d4-9a31-d45852252007',
      lat: '-25.506812802663905',
      lng: '-49.24192428588867',
      title: 'Mock Place 02',
    },
    {
      id: 'c0e8f1c2-90b7-495e-a95e-6be62e530985',
      lat: '-25.491473729092522',
      lng: '-49.27315056324005',
      title: 'Mock Place 03',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MapService, HttpClient, NgxSpinnerService, MessageService],
    });
    service = TestBed.inject(MapService);
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPoints', () => {
    it('should return a list of Points', () => {
      service.getPoints().then((points) => {
        expect(points.length).toBe(3);
        expect(points).toEqual(mockPoints);
      });

      const req = httpMock.expectOne(`${service.baseUrl}/points`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPoints);
    });
  });

  describe('getPoint', () => {
    it('should return one selected point', () => {
      let id = 'bd9086de-65ff-4ecf-a015-26f52637aebb';
      service.getPoint(id).then((point) => {
        expect(point).toEqual(mockPoints[1]);
      });

      const req = httpMock.expectOne(`${service.baseUrl}/points/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPoints[1]);
    });
  });
});
