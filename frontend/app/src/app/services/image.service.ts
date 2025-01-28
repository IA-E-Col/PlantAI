import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getHeatmap(imagePath: string, modelPath: string): Observable<Blob> {
    const params = { image_path: imagePath, model_path: modelPath };
    return this.http.get(`${this.apiUrl}/heatmap`, { params, responseType: 'blob' });
  }

  getAllStats(imagePath: string): Observable<any> {
    const params = { image_path: imagePath };
    return this.http.get(`${this.apiUrl}/all_stats`, { params });
  }
}
