import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, tap, throwError} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {LoginService} from "./login.service";
import {LinkedList} from "ngx-bootstrap/utils";


export interface Specimen {
  id: number;
  baseDEnregistrement: string;
  codeInstitution: string;
  collectionCode: string;
  catalogueCode: string;
  identificationRemarques: string;
  nomScientifiqueAuteur: string;
  genre: string;
  epitheteSpecifique: string;
  famille: string;
  nomScientifique: string;
  pays: string;
  departement: string;
  ville: string;
  lieu: string;
  enregistrePar: string;
  dateCreation: string;
  latitude: number;
  longitude: number;
  codePays: string;
}
@Injectable({
  providedIn: 'root'
})



// Create a list of specimens

export class ProjetService {
  projets! : Array<any>
  projet!:any;
  name! : string
  collection_actuelle!: any;
  p! : LinkedList<any>;
  Url! : 'http://localhost:8080/api/projets/';
   k: any[][] = [['Afrique australe'], [], [], [], [], []];
   collections={
     datasets :Array<any>
   }
  dataset = {
      name : "Collection",
      description : "descrption Collection",
    }
  specimens!: any;
  specimenstosend: Specimen[] = []

  constructor(private http:HttpClient) {}

// List des projets "Creer"
  funcS_get_All(): Observable<Array<any>>{
    const userString = localStorage.getItem("authUser");
    if (userString !== null) {
      const user = JSON.parse(userString);
      let userId = user.user.id; // recuperer aussi les projets collab
      return  this.http.get<any>(`http://localhost:8080/api/projets/list/PCR/${userId}`);
    }
    return of([]);
  }

  func_get_Id(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/projets/${id}`).pipe(
      tap((projet) => {
        this.projet = projet; // Stockez les données du projet dans la variable du service
      })
    );
  }

  func_predict(s: any,modeleId :any): Observable<any> {
    console.log(s, modeleId)
    return this.http.get<any>(`http://localhost:8080/api/models/predict/${s}/${modeleId}`);
  }

  func_predict_dataset(datasetId:any): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/models/predictDataset/${datasetId}/1`);
  }

  func_get_createur(IdP:any):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/projets/${IdP}/createur`);
  }

  func_get_Specimen(IdS:any):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/specimen/${IdS}`);
  }

  func_get_Model(IdM:any):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/models/${IdM}`);
  }
  func_get_Annotation(IdA:any):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/specimen/Annotation/${IdA}`);
  }

  func_ajout_proj(p: any,cID:any): Observable<any>{
    const userString = localStorage.getItem("authUser");
    if (userString !== null) {
      const user = JSON.parse(userString);
      let userId = user.user.id;
      this.http.post<any>(`http://localhost:8080/api/projets/add/${userId}/${cID}`,p).subscribe({
        next : (data)=>{
          console.log(data);
        },
        error : err =>{
          alert("erreur ajout_prjt");
        }
      })
    }
    return of(p)
  }

  func_modif_proj(Vprojet: any,projet: any, projectId : any):Observable<any>{
    console.log('chouf hna 1', Vprojet)
    console.log('chouf hna 1', projet)
    Vprojet.nomProjet = projet.nomProjet;
    Vprojet.description = projet.description;
    Vprojet.etat = projet.etat;
    console.log('chouf hna 2', Vprojet)
    console.log('chouf hna 2', projet)
    return this.http.put<any>(`http://localhost:8080/api/projets/update/${projectId}`,Vprojet);
  }

  func_ajout_collab(IdP:any, IdC:any): Observable<any>{
    return this.http.put<any>(`http://localhost:8080/api/projets/${IdP}/addCollab/${IdC}`,null);
  }

  func_suppr_collab(IdP:any, IdC:any): Observable<any>{
    return this.http.delete<any>(`http://localhost:8080/api/projets/delete/${IdP}/collab/${IdC}`);
  }

  func_get_collab(IdP:any):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/projets/${IdP}/collaborateurs`);
  }

  func_supp_prj(IdP:any):Observable<any>{
    return this.http.delete<any>(`http://localhost:8080/api/projets/delete/${IdP}`);
  }

  func_get_username(){
    const userString = localStorage.getItem("authUser");
    if (userString !== null) {
      const user = JSON.parse(userString);
      return  user.user.username;
    }
  }

  func_get_users(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/users/');
  }

  func_get_possible_collaborators(idP : number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/projets/${idP}/possible_collaborators`);
  }

  func_get_Champs_Filtre():Observable<Array<any>>{
    return this.http.get<any[]>('http://localhost:8080/api/specimen/ValeurFilters');
  }

  func_get_Specimen_Filtred(p: any,idProjet:any):Observable<any>{
    return this.http.post<any[]>(`http://localhost:8080/api/specimen/MR/${idProjet}`,p);
  }

  /*func_add_Specimen_to_Collection(iDP:any):Observable<any>{
    this.dataset.specimens = this.specimens
    return this.http.post<any[]>(`http://localhost:8080/api/collections/addCollection/${iDP}`,this.collection);
  }*/
  func_add_Dataset(idP:any):Observable<any>{
    return this.http.post<any[]>(`http://localhost:8080/api/collections/addDataset/${idP}`,this.dataset);
  }
  func_add_Specimens_To_Dataset(IDdataset:any):Observable<any>{

    return this.http.post<any[]>(`http://localhost:8080/api/collections/addSpecimensToDataset/${IDdataset}`,this.specimenstosend.map(objet => objet.id));
  }
  func_add_collection(col:any):Observable<any>{
    return this.http.post<any[]>(`http://localhost:8080/api/collections/addCollection`,col);
  }
  func_modifer_profile(user:any):Observable<any>{
    return this.http.put<any>(`http://localhost:8080/api/users/modifier`,user);
  }

  func_delete_collection(id:any):Observable<any>{
    return this.http.delete<any>(`http://localhost:8080/api/collections/delete/${id}`);
  }

  func_get_dataset(id:any):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/collections/dataset/${id}`);
  }

  func_get_Prj_Cree(): Observable<Array<any>>{
    const userString = localStorage.getItem("authUser");
    if (userString !== null) {
      const user = JSON.parse(userString);
      let userId = user.user.id; // recuperer aussi les projets collab
      return  this.http.get<any>(`http://localhost:8080/api/projets/list/PCR/${userId}`);
    }
    return of([]);
  }
  func_get_AllPrj_User(): Observable<Array<any>>{
    const userString = localStorage.getItem("authUser");
    if (userString !== null) {
      const user = JSON.parse(userString);
      let userId = user.user.id; // recuperer aussi les projets collab
      return  this.http.get<any>(`http://localhost:8080/api/projets/list/user/${userId}`);
    }
    return of([]);
  }
  // List des projets "Collab"
  func_get_Prj_Collab(): Observable<Array<any>>{
    const userString = localStorage.getItem("authUser");
    if (userString !== null) {
      const user = JSON.parse(userString);
      let userId = user.user.id; // recuperer aussi les projets collab
      return  this.http.get<any>(`http://localhost:8080/api/projets/list/PCO/${userId}`);
    }
    return of([]);
  }

  func_get_All_collection():Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/collections/list`);
  }


  func_get_collection_by_id(id:any): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/collections/${id}`);
  }

  func_get_All_models():Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/models/`);
  }
  func_get_All_modelsForFiltre():Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/models/forFiltre`);
  }

  func_get_DatasetsById(id: any) :Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/projets/${id}/Datasets`);
  }
  func_get_SpecimenByCollection(id: any) :Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/collections/${id}/Specimens`);
  }
  func_get_SpecimenByDataset(id: any) :Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/collections/Dataset/${id}/specimen`);
  }
  importCsv(file: File, idCollection: any): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`http://127.0.0.1:8080/import-csv/${idCollection}`, formData);
  }
  addClasse(classe: any): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8080/api/annotationModele/addClasse', classe);
  }
  func_get_All_classe(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8080/api/annotationModele/getAllClasse');
  }
  addModel(model:any): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8080/api/models/addModel', model );
  }

  addClassesToModel(idModel:any,classes: any): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:8080/api/models/addClasseToModel/${idModel}`, classes);
  }

  func_get_Classes_ByModel(idModele: any): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8080/api/models/${idModele}/classes`);
  }

  func_update_annotation(Annotation: any) : Observable<any> {
    return this.http.put<any>(`http://127.0.0.1:8080/api/annotationModele/updateAnnotationSpecimen`,Annotation);
  }
  getComments(idAnnotation: number): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8080/api/annotationModele/${idAnnotation}/comments`);
  }

  // Méthode pour ajouter un commentaire
  addCommentToAnnotation(idAnnotation: number, idUser: number, commentaire: any): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:8080/api/annotationModele/${idAnnotation}/${idUser}/addComment`, commentaire);
  }
}
