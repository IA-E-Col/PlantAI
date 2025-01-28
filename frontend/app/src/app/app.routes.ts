import { Routes } from '@angular/router';
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

import { ExplorerDetailsComponent } from "./components/explorer-details/explorer-details.component";
import { CollectionInfoComponent } from "./components/collection-info/collection-info.component";
import { CollectionImgComponent } from "./components/collection-img/collection-img.component";
import { CollectionDashboardComponent } from "./components/collection-dashboard/collection-dashboard.component";
import { GererCollectionComponent } from "./components/gerer-collection/gerer-collection.component";

import { ListImagesComponent } from "./components/list-images/list-images.component";
import { ImagesFormComponent } from "./components/images-form/images-form.component";
import { CollectionInfComponent } from "./components/collection-inf/collection-inf.component";
import { CreateCollectionModalComponent } from "./components/create-collection-modal/create-collection-modal.component";
import { ModelInfComponent } from "./components/model-inf/model-inf.component";
import { GererDatasetComponent } from "./components/gerer-dataset/gerer-dataset.component";
import { DatasetPredictionComponent } from "./components/dataset-prediction/dataset-prediction.component";
import { CreeModeleComponent } from "./components/cree-modele/cree-modele.component";
import { CreeCollectionComponent } from "./components/cree-collection/cree-collection.component";
export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  {
    path: 'admin', component: AdminTemplateComponent, canActivate: [authenticationGuard], children: [
      { path: 'projets', component: ProjetsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', component: ProjetsComponent },
      { path: 'explorer', component: ExplorerComponent },
      { path: 'collection/total', component: CollectionComponent },
      { path: 'models', component: ModeleComponent },
      { path: 'classes', component: ClasseComponent },
      {
        path: 'DatasetPrediction', component: DatasetPredictionComponent,
        children: [
          { path: 'cree', component: CreateCollectionModalComponent },
        ]
      },
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
        path: 'projbar/:id',
        component: ProjbarComponent,
        children: [
          { path: 'collection/:Id', component: CollectionComponent },
          { path: 'dashboard/:Id', component: DashboardComponent },
          { path: 'projetInf/:id', component: ProjetInfComponent },
          { path: 'gererprojet/:id', component: GererprojetComponent },
          { path: 'ajoutercollab/:id', component: AjouterCollabComponent },
          { path: 'supprcollab/:id', component: SupprimerCollabComponent },
          { path: '', component: ProjetInfComponent },
        ]
      },
      {
        path: 'explore-details/:id',
        component: ExplorerDetailsComponent,
        children: [
          { path: '', component: CollectionInfoComponent },
          { path: 'collectionInf/:Id', component: CollectionInfoComponent },
          { path: 'collectionImg/:Id', component: CollectionImgComponent },
          { path: 'collectionDashboard/:Id', component: CollectionDashboardComponent },
          { path: 'gerercollection/:Id', component: GererCollectionComponent }
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
        path: 'collection-inf',
        component: CollectionInfComponent,
        children: [
        //  { path: '', component: ListImagesComponent, data: { afficherBouton: false } },
          { path: 'Images/:id', component: ListImagesComponent, data: { afficherBouton: false } },
          { path: 'dashboard_dataset/:id', component: DashboardDatasetComponent },
          { path: 'datasetInf/:id', component: DatasetInfComponent },
          { path: 'Models/:id', component: DatasetModelComponent },
          { path: 'gererdataset/:id', component: GererDatasetComponent },
        ]
      },
      { path: 'model_inf/:id', component: ModelInfComponent }
    ]
  },

];
