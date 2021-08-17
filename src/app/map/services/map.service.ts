import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Point } from '../model/point.model';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private baseUrl = environment.apiEndpoint;

  constructor(private http: HttpClient, private messageService: MessageService) {}

  public createPoint(lat: string, lng: string, title: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.post<Point>(`${this.baseUrl}/points`, { lat, lng, title }).subscribe(
        (createdPoint) => {
          resolve(createdPoint);
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'New Point',
            life: 6000,
            detail: `Error creating new point:\n ${error.error.message}`,
          });
        }
      );
    });
  }

  public updatePoint(id: string, title: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.patch<Point>(`${this.baseUrl}/points/${id}`, { title }).subscribe(
        (createdPoint) => {
          resolve(createdPoint);
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Update Point',
            life: 6000,
            detail: `Error updating point:\n ${error.error.message}`,
          });
        }
      );
    });
  }

  public removePoint(id: string): Promise<any> {
    return new Promise((resolve) => {
      return this.http.delete<any[]>(`${this.baseUrl}/points/${id}`).subscribe(
        () => {
          resolve(true);
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Remove Point',
            life: 6000,
            detail: `Error removing point:\n ${error.error.message}`,
          });
        }
      );
    });
  }

  public getPoints(): Promise<any> {
    return new Promise((resolve) => {
      this.http.get<Point[]>(`${this.baseUrl}/points`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Retrieving Points',
            life: 6000,
            detail: `Error retrieving points:\n ${error.error.message}`,
          });
        }
      );
    });
  }

  public getPoint(id: string): Promise<Point> {
    return new Promise((resolve) => {
      this.http.get<Point>(`${this.baseUrl}/points/${id}`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Retrieving Point',
            life: 6000,
            detail: `Error retrieving points:\n ${error.error.message}`,
          });
        }
      );
    });
  }
}
