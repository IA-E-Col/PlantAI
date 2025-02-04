import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  private corpusId = new BehaviorSubject<string | null>(null);
  private projectId = new BehaviorSubject<string | null>(null);
  private modelId = new BehaviorSubject<string | null>(null);
  private datasetId = new BehaviorSubject<string | null>(null);
  private classeId = new BehaviorSubject<string | null>(null);
  corpusId$ = this.corpusId.asObservable();
  projectId$ = this.projectId.asObservable();
  modelId$ = this.modelId.asObservable();
  classeId$ = this.classeId.asObservable();
  datasetId$ = this.datasetId.asObservable();
  setCorpusId(id: string) {
    this.corpusId.next(id);
  }
  setProjectId(id: string) {
    this.projectId.next(id);
  }
  setModelId(id: string) {
    this.modelId.next(id);
  }
  setClassesId(id: string) {
    this.classeId.next(id);
  }
  setDatasetId(id: string) {
    this.datasetId.next(id);
  }
}
