import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { authenticationGuard } from "./guards/authentication.guard";
import { ActivateAccountComponent } from './components/activate-account/activate-account.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

// Lazy load components using dynamic imports
const loadAdminTemplate = () => import('./components/admin-template/admin-template.component').then(m => m.AdminTemplateComponent);
const loadProjets = () => import('./components/projets/projets.component').then(m => m.ProjetsComponent);
const loadModele = () => import('./components/modele/modele.component').then(m => m.ModeleComponent);
const loadClasse = () => import('./components/classe/classe.component').then(m => m.ClasseComponent);
const loadExplorer = () => import('./components/explorer/explorer.component').then(m => m.ExplorerComponent);
const loadCollection = () => import('./components/collection/collection.component').then(m => m.CollectionComponent);
const loadNewprojet = () => import('./components/newprojet/newprojet.component').then(m => m.NewprojetComponent);
const loadProjbar = () => import('./components/projbar/projbar.component').then(m => m.ProjbarComponent);
const loadProjetInf = () => import('./components/projet-inf/projet-inf.component').then(m => m.ProjetInfComponent);
const loadAjouterCollab = () => import('./components/ajouter-collab/ajouter-collab.component').then(m => m.AjouterCollabComponent);
const loadGererprojet = () => import('./components/gererprojet/gererprojet.component').then(m => m.GererprojetComponent);
const loadSupprimerCollab = () => import('./components/supprimer-collab/supprimer-collab.component').then(m => m.SupprimerCollabComponent);
const loadFormulaire = () => import('./components/formulaire/formulaire.component').then(m => m.FormulaireComponent);
const loadImageInf = () => import('./components/image-inf/image-inf.component').then(m => m.ImageInfComponent);
const loadAnnotationDetail = () => import('./components/annotation-detail/annotation-detail.component').then(m => m.AnnotationDetailComponent);
const loadProfile = () => import('./components/profile/profile.component').then(m => m.ProfileComponent);
const loadDashboard = () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent);
const loadDatasetInf = () => import('./components/dataset-inf/dataset-inf.component').then(m => m.DatasetInfComponent);
const loadDatasetModel = () => import('./components/dataset-model/dataset-model.component').then(m => m.DatasetModelComponent);
const loadDashboardDataset = () => import('./components/dashboard-dataset/dashboard-dataset.component').then(m => m.DashboardDatasetComponent);
const loadUpdateModele = () => import('./components/update-modele/update-modele.component').then(m => m.UpdateModeleComponent);
const loadCreeModele = () => import('./components/cree-modele/cree-modele.component').then(m => m.CreeModeleComponent);
const loadCreeCollection = () => import('./components/cree-collection/cree-collection.component').then(m => m.CreeCollectionComponent);
const loadCreateCollectionModal = () => import('./components/create-collection-modal/create-collection-modal.component').then(m => m.CreateCollectionModalComponent);
const loadExplorerDetails = () => import('./components/explorer-details/explorer-details.component').then(m => m.ExplorerDetailsComponent);
const loadCollectionInfo = () => import('./components/collection-info/collection-info.component').then(m => m.CollectionInfoComponent);
const loadCollectionImg = () => import('./components/collection-img/collection-img.component').then(m => m.CollectionImgComponent);
const loadCollectionDashboard = () => import('./components/collection-dashboard/collection-dashboard.component').then(m => m.CollectionDashboardComponent);
const loadGererCollection = () => import('./components/gerer-collection/gerer-collection.component').then(m => m.GererCollectionComponent);
const loadValidationHistory = () => import('./components/validation-history/validation-history.component').then(m => m.ValidationHistoryComponent);
const loadListImages = () => import('./components/list-images/list-images.component').then(m => m.ListImagesComponent);
const loadImagesForm = () => import('./components/images-form/images-form.component').then(m => m.ImagesFormComponent);
const loadCollectionInf = () => import('./components/collection-inf/collection-inf.component').then(m => m.CollectionInfComponent);
const loadModelInf = () => import('./components/model-inf/model-inf.component').then(m => m.ModelInfComponent);
const loadGererDataset = () => import('./components/gerer-dataset/gerer-dataset.component').then(m => m.GererDatasetComponent);
const loadDatasetPrediction = () => import('./components/dataset-prediction/dataset-prediction.component').then(m => m.DatasetPredictionComponent);
const loadAnnotationValidation = () => import('./components/annotation-validation/annotation-validation.component').then(m => m.AnnotationValidationComponent);
const loadScores = () => import('./components/scores/scores.component').then(m => m.ScoresComponent);
const loadExportannotation = () => import('./components/exportannotation/exportannotation.component').then(m => m.ExportannotationComponent);
const loadSpecimenSelection = () => import('./components/specimen-selection/specimen-selection.component').then(m => m.SpecimenSelectionComponent);

export const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  {
    path: 'activate-account',
    component: ActivateAccountComponent
  },
  {
    path: 'admin', 
    loadComponent: loadAdminTemplate, 
    canActivate: [authenticationGuard], 
    children: [
      { path: 'projects', loadComponent: loadProjets },
      { path: 'profile', loadComponent: loadProfile },
      { path: 'validation-history', loadComponent: loadValidationHistory },
      { path: 'corpus', loadComponent: loadExplorer },
      { path: 'datasets', loadComponent: loadCollection },
      { path: 'models', loadComponent: loadModele },
      { path: 'classes', loadComponent: loadClasse },
      {
        path: 'formulaire', 
        loadComponent: loadFormulaire,
        children: [
          {
            path: 'images-form/:id',
            loadComponent: loadImagesForm,
            children: [
              { path: 'cree', loadComponent: loadCreateCollectionModal },
            ]
          },
          { path: '', loadComponent: loadCollectionImg }
        ]
      },
      { path: 'newprojet', loadComponent: loadNewprojet },
      { path: 'image-inf/:catalogueCode', loadComponent: loadImageInf },
      { path: 'datasets/:datasetId/images/:specimenId/models/:modelId/annotation-validation', loadComponent: loadAnnotationDetail },
      { path: 'NewModel', loadComponent: loadCreeModele },
      { path: 'UpdateMode', loadComponent: loadUpdateModele },
      { path: 'NewCollection', loadComponent: loadCreeCollection },
      {
        path: 'projects/:id',
        loadComponent: loadProjbar,
        children: [
          { path: 'datasets', loadComponent: loadCollection },
          { path: 'dashboard', loadComponent: loadDashboard },
          { path: 'details', loadComponent: loadProjetInf },
          { path: 'edit', loadComponent: loadGererprojet },
          { path: 'collaborators', loadComponent: loadAjouterCollab },
          { path: 'supprcollab/:id', loadComponent: loadSupprimerCollab },
          { path: '', loadComponent: loadProjetInf },
        ]
      },
      {
        path: 'models/:id/model-library',
        loadComponent: loadModelInf,
      },
      {
        path: 'models/:id/edit',
        loadComponent: loadUpdateModele,
      },
      {
        path: 'corpus/:id',
        loadComponent: loadExplorerDetails,
        children: [
          { path: 'details', loadComponent: loadCollectionInfo },
          { path: 'images', loadComponent: loadCollectionImg },
          { path: 'dashboard', loadComponent: loadCollectionDashboard },
          { path: 'edit', loadComponent: loadGererCollection },
          { path: 'images/:catalogueCode', loadComponent: loadImageInf }
        ]
      },
      {
        path: 'list_images/:id',
        loadComponent: loadListImages,
        children: [
          { path: 'cree', loadComponent: loadCreateCollectionModal },
        ]
      },
      {
        path: 'datasets/:id',
        loadComponent: loadCollectionInf,
        children: [
          { path: 'images', loadComponent: loadListImages, data: { afficherBouton: false } },
          { path: 'dashboard', loadComponent: loadDashboardDataset },
          { path: 'details', loadComponent: loadDatasetInf },
          { path: 'models', loadComponent: loadDatasetModel },
          { path: 'edit', loadComponent: loadGererDataset },
          { path: 'add-specimens', loadComponent: loadSpecimenSelection },
          { path: 'validation_history', loadComponent: loadValidationHistory },
          { path: 'images/:catalogueCode', loadComponent: loadImageInf },
          { path: 'import_export_annotation', loadComponent: loadExportannotation },
          {
            path: 'datasetPrediction/:modelId', 
            loadComponent: loadDatasetPrediction,
            children: [
              { path: 'cree', loadComponent: loadCreateCollectionModal },
            ]
          },
        ]
      },
      { path: 'annotation_validation', loadComponent: loadAnnotationValidation },
      { path: 'scores', loadComponent: loadScores },
    ]
  },
];
