import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  private apiUrl = 'http://localhost:8080/api/';

  private getAnnotationsUrl = 'annotationModele/annotations'
  constructor(private http: HttpClient) {}

  getAnnotationsByDataset(datasetId : string, userId : string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.getAnnotationsUrl}/${userId}/${datasetId}`);
  }
  importAnnotations(formData : FormData) : Observable<any[]> {
    const importUrl ='import/import-annotations'
    return this.http.post<any[]>(this.apiUrl + importUrl, formData);
  }
}
