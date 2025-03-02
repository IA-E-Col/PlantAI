import { Routes } from '@angular/router';
import { ScoresComponent } from './components/scores/scores.component';
import { ProjetsComponent } from "./components/projets/projets.component";
import { ModeleComponent } from "./components/modele/modele.component";
import { ClasseComponent } from "./components/classe/classe.component";
import { ExplorerComponent } from "./components/explorer/explorer.component";
import { CollectionComponent } from "./components/collection/collection.component";
import { NewprojetComponent } from "./components/newprojet/newprojet.component";
import { ProjbarComponent } from "./components/projbar/projbar.component";
import { ProjetInfComponent } from "./components/projet-inf/projet-inf.component";
import { LoginComponent } from "./components/login/login.component";
import { AdminTemplateComponent } from "./components/admin-template/admin-template.component";
import { authenticationGuard } from "./guards/authentication.guard";
import { AjouterCollabComponent } from "./components/ajouter-collab/ajouter-collab.component";
import { GererprojetComponent } from "./components/gererprojet/gererprojet.component";
import { SupprimerCollabComponent } from "./components/supprimer-collab/supprimer-collab.component";
import { FormulaireComponent } from "./components/formulaire/formulaire.component";
import { ImageInfComponent } from './components/image-inf/image-inf.component';
import { AnnotationDetailComponent } from "./components/annotation-detail/annotation-detail.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DatasetInfComponent } from "./components/dataset-inf/dataset-inf.component";
import { DatasetModelComponent } from "./components/dataset-model/dataset-model.component";
import { DashboardDatasetComponent } from "./components/dashboard-dataset/dashboard-dataset.component";
import { UpdateModeleComponent } from "./components/update-modele/update-modele.component";
import {ActivateAccountComponent} from "./components/activate-account/activate-account.component";

import { ExplorerDetailsComponent } from "./components/explorer-details/explorer-details.component";
import { CollectionInfoComponent } from "./components/collection-info/collection-info.component";
import { CollectionImgComponent } from "./components/collection-img/collection-img.component";
import { CollectionDashboardComponent } from "./components/collection-dashboard/collection-dashboard.component";
import { GererCollectionComponent } from "./components/gerer-collection/gerer-collection.component";
import { ValidationHistoryComponent } from "./components/validation-history/validation-history.component";

import { ListImagesComponent } from "./components/list-images/list-images.component";
import { ImagesFormComponent } from "./components/images-form/images-form.component";
import { CollectionInfComponent } from "./components/collection-inf/collection-inf.component";
import { CreateCollectionModalComponent } from "./components/create-collection-modal/create-collection-modal.component";
import { ModelInfComponent } from "./components/model-inf/model-inf.component";
import { GererDatasetComponent } from "./components/gerer-dataset/gerer-dataset.component";
import { DatasetPredictionComponent } from "./components/dataset-prediction/dataset-prediction.component";
import { CreeModeleComponent } from "./components/cree-modele/cree-modele.component";
import { CreeCollectionComponent } from "./components/cree-collection/cree-collection.component";
import { AnnotationValidationComponent } from './components/annotation-validation/annotation-validation.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
export const routes: Routes = [
  {path : 'signup', component: SignUpComponent},
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  {
    path: 'activate-account',
    component: ActivateAccountComponent
  },
  {
    path: 'admin', component: AdminTemplateComponent, canActivate: [authenticationGuard], children: [
      { path: 'projects', component: ProjetsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'validation-history', component: ValidationHistoryComponent },
      { path: '', component: ProjetsComponent },
      { path: 'corpus', component: ExplorerComponent },
      { path: 'datasets', component: CollectionComponent },
      { path: 'models', component: ModeleComponent ,},
      { path: 'classes', component: ClasseComponent },
      {
        path: 'formulaire', component: FormulaireComponent,
        children: [
          {
            path: 'images-form/:id',
            component: ImagesFormComponent,
            children: [
              { path: 'cree', component: CreateCollectionModalComponent },
            ]
          },
          { path: '', component: CollectionImgComponent }
        ]
      }, // modifier
      { path: 'newprojet', component: NewprojetComponent },
      { path: 'image-inf/:catalogueCode', component: ImageInfComponent },
      { path: 'AnnotationDetail', component: AnnotationDetailComponent },
      { path: 'NewModel', component: CreeModeleComponent },
      { path: 'UpdateMode', component: UpdateModeleComponent },
      { path: 'NewCollection', component: CreeCollectionComponent },
      {
        path: 'projects/:id',
        component: ProjbarComponent,
        children: [
          { path: 'datasets', component: CollectionComponent },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'details', component: ProjetInfComponent },
          { path: 'edit', component: GererprojetComponent },
          { path: 'collaborators', component: AjouterCollabComponent },
          { path: 'supprcollab/:id', component: SupprimerCollabComponent },
          { path: 'validation-history', component: ValidationHistoryComponent }, // ✅ Ajout ici
          { path: '', component: ProjetInfComponent },
        ]
      },
      {
        path: 'models/:id/model-library',
        component: ModelInfComponent,
      },
      {
        path: 'models/:id/edit',
        component: UpdateModeleComponent,
      },
      {
        path: 'corpus/:id',
        component: ExplorerDetailsComponent,
        children: [
          { path: 'details', component: CollectionInfoComponent },
          { path: 'images', component: CollectionImgComponent },
          { path: 'dashboard', component: CollectionDashboardComponent },
          { path: 'edit', component: GererCollectionComponent },
          {path: 'images/:catalogueCode', component: ImageInfComponent}
        ]
      },
      {
        path: 'list_images/:id',
        component: ListImagesComponent,
        children: [
          { path: 'cree', component: CreateCollectionModalComponent },
        ]
      },
      {
        path: 'datasets/:id',
        component: CollectionInfComponent,
        children: [
        //  { path: '', component: ListImagesComponent, data: { afficherBouton: false } },
          { path: 'images', component: ListImagesComponent, data: { afficherBouton: false } },
          { path: 'dashboard', component: DashboardDatasetComponent },
          { path: 'details', component: DatasetInfComponent },
          { path: 'models', component: DatasetModelComponent },
          { path: 'edit', component: GererDatasetComponent },
          { path: 'images/:catalogueCode', component: ImageInfComponent },
          {
            path: 'datasetPrediction/:modelId', component: DatasetPredictionComponent,
            children: [
              { path: 'cree', component: CreateCollectionModalComponent },
            ]
          },
        ]
      },
      { path: 'annotation_validation', component: AnnotationValidationComponent },
      { path: 'scores', component: ScoresComponent },
    ]
  },  

];
