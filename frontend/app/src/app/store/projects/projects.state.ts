export interface Project {
  id: number;
  nomProjet: string;
  description: string;
  dateCreation: number;
  collaborateurs: any[];
  collection: {
    id: number;
    nom: string;
    description: string;
    dateCreation: number;
  } | null;
  createur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    fullName: string;
  } | null;
  numberOfSpecimen: number;
  numberOfDataset: number;
}

export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}
