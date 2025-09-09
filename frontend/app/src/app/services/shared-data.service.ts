import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import * as SharedActions from '../store/shared/shared.actions';
import { selectAllModels, selectModelsLoading, selectModelsError } from '../store/models/models.selectors';
import { selectAllCollections, selectCollectionsLoading, selectCollectionsError } from '../store/collections/collections.selectors';
import { selectAllProjects, selectProjectsLoading, selectProjectsError } from '../store/projects/projects.selectors';
import { selectAllUsers, selectUsersLoading, selectUsersError } from '../store/users/users.selectors';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor(private store: Store<AppState>) {}

  // Smart loading methods that check cache first
  loadModelsIfNeeded(): void {
    this.store.dispatch(SharedActions.loadModelsIfNeeded());
  }

  loadCollectionsIfNeeded(): void {
    this.store.dispatch(SharedActions.loadCollectionsIfNeeded());
  }

  loadProjectsIfNeeded(userId: string): void {
    this.store.dispatch(SharedActions.loadProjectsIfNeeded({ userId }));
  }

  loadUsersIfNeeded(): void {
    this.store.dispatch(SharedActions.loadUsersIfNeeded());
  }

  // Preload essential data
  preloadEssentialData(userId: string): void {
    this.store.dispatch(SharedActions.preloadEssentialData({ userId }));
  }

  // Cache invalidation methods
  invalidateModelsCache(): void {
    this.store.dispatch(SharedActions.invalidateModelsCache());
  }

  invalidateCollectionsCache(): void {
    this.store.dispatch(SharedActions.invalidateCollectionsCache());
  }

  invalidateProjectsCache(): void {
    this.store.dispatch(SharedActions.invalidateProjectsCache());
  }

  invalidateUsersCache(): void {
    this.store.dispatch(SharedActions.invalidateUsersCache());
  }

  // Selectors for data access
  getModels(): Observable<any[]> {
    return this.store.select(selectAllModels);
  }

  getModelsLoading(): Observable<boolean> {
    return this.store.select(selectModelsLoading);
  }

  getModelsError(): Observable<string | null> {
    return this.store.select(selectModelsError);
  }

  getCollections(): Observable<any[]> {
    return this.store.select(selectAllCollections);
  }

  getCollectionsLoading(): Observable<boolean> {
    return this.store.select(selectCollectionsLoading);
  }

  getCollectionsError(): Observable<string | null> {
    return this.store.select(selectCollectionsError);
  }

  getProjects(): Observable<any[]> {
    return this.store.select(selectAllProjects);
  }

  getProjectsLoading(): Observable<boolean> {
    return this.store.select(selectProjectsLoading);
  }

  getProjectsError(): Observable<string | null> {
    return this.store.select(selectProjectsError);
  }

  getUsers(): Observable<any[]> {
    return this.store.select(selectAllUsers);
  }

  getUsersLoading(): Observable<boolean> {
    return this.store.select(selectUsersLoading);
  }

  getUsersError(): Observable<string | null> {
    return this.store.select(selectUsersError);
  }
}
