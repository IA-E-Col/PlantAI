import { AuthState } from './auth/auth.state';
import { ProjectsState } from './projects/projects.state';
import { CollectionsState } from './collections/collections.state';
import { ModelsState } from './models/models.state';
import { NavigationState } from './navigation/navigation.state';
import { AnnotationState } from './annotations/annotations.state';
import { UserState } from './users/users.state';
import { ErrorState } from './error/error.state';

export interface AppState {
  auth: AuthState;
  projects: ProjectsState;
  collections: CollectionsState;
  models: ModelsState;
  navigation: NavigationState;
  annotations: AnnotationState;
  users: UserState;
  error: ErrorState;
}
