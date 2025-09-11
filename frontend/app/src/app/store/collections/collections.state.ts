export interface Collection {
  id: number;
  nom: string;
  description: string;
  dateCreation: number;
  creator?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  specimens?: Specimen[];
}

export interface Specimen {
  id: number;
  nom?: string;
  famille: string;
  genre: string;
  espece?: string;
  epitheteSpecifique: string;
  nomScientifique: string;
  nomScientifiqueAuteur: string;
  variete?: string;
  collecteurPrincipal?: string;
  numeroObservation?: string;
  dateRecolte?: string;
  paysRecolte?: string;
  pays: string;
  departement: string;
  ville: string;
  lieu: string;
  localiteRecolte?: string;
  milieRecolte?: string;
  dateCreation: string;
  latitude: number | null;
  longitude: number | null;
  codePays?: string;
  medias?: Media[];
  collection?: Collection;
  image?: {
    id: number;
    image_url: string;
    image_path: string;
    rdf_path: string;
    codeMedia: string;
  };
}

export interface Media {
  id: number;
  codeMedia: string;
  image_url: string;
  rdf_path: string;
  image_path: string;
}

export interface Dataset {
  id: number;
  name: string; // Matches backend DataSet entity
  description: string;
  specimens: Specimen[];
  projet?: {
    id: number;
    nomProjet: string;
    description: string;
    dateCreation: string;
  };
  numberOfSpecimen?: number; // For display purposes
}

export interface CollectionsState {
  // Collections
  collections: Collection[];
  currentCollection: Collection | null;
  
  // Specimens
  specimens: Specimen[];
  filteredSpecimens: Specimen[];
  currentSpecimen: Specimen | null;
  
  // Datasets
  datasets: Dataset[];
  currentDataset: Dataset | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Filter State
  filters: {
    famille?: string;
    genre?: string;
    espece?: string;
    paysRecolte?: string;
    searchText?: string;
  };
}

export const initialCollectionsState: CollectionsState = {
  collections: [],
  currentCollection: null,
  specimens: [],
  filteredSpecimens: [],
  currentSpecimen: null,
  datasets: [],
  currentDataset: null,
  isLoading: false,
  error: null,
  filters: {},
};