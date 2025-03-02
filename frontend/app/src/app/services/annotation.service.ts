import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Annotation {
  id: number;
  name: string;
  submissionDate: string;
  etat: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  getAnnotations(): Observable<Annotation[]> {
    return this.http.get<Annotation[]>(this.apiUrl);
  }
}
