export interface Model {
  id: number;
  nom: string;
  description: string;
  dateCreation: number;
  precision?: number;
  accuracy?: number;
  f1Score?: number;
  recall?: number;
  status: 'TRAINING' | 'COMPLETED' | 'FAILED' | 'DEPLOYED';
  trainingProgress?: number;
  createur?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  annotation?: ModelAnnotation;
  classes?: ModelClass[];
  datasets?: any[];
  predictions?: Prediction[];
}

export interface ModelClass {
  id: number;
  nom: string;
  description?: string;
  couleur?: string;
  ordre?: number;
  annotations?: any[];
}

export interface ModelAnnotation {
  id: number;
  classeAnnotationS?: ModelClass[];
  annotationMDL?: any;
}

export interface Prediction {
  id: number;
  specimenId: number;
  modelId: number;
  predictedClass: string;
  confidence: number;
  probability: number;
  createdAt: string;
  isValidated?: boolean;
  validatedBy?: number;
  validatedAt?: string;
}

export interface TrainingJob {
  id: number;
  modelId: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  logs?: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix?: number[][];
  classMetrics?: {
    [className: string]: {
      precision: number;
      recall: number;
      f1Score: number;
      support: number;
    };
  };
}

export interface ModelsState {
  // Models
  models: Model[];
  currentModel: Model | null;
  
  // Classes
  classes: ModelClass[];
  currentClass: ModelClass | null;
  
  // Predictions
  predictions: Prediction[];
  filteredPredictions: Prediction[];
  
  // Training
  trainingJobs: TrainingJob[];
  currentTrainingJob: TrainingJob | null;
  
  // Metrics & Analytics
  modelMetrics: { [modelId: number]: ModelMetrics };
  
  // UI State
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Filter State
  filters: {
    status?: string;
    minAccuracy?: number;
    maxAccuracy?: number;
    createdBy?: number;
    searchText?: string;
  };
}

export const initialModelsState: ModelsState = {
  models: [],
  currentModel: null,
  classes: [],
  currentClass: null,
  predictions: [],
  filteredPredictions: [],
  trainingJobs: [],
  currentTrainingJob: null,
  modelMetrics: {},
  isLoading: false,
  error: null,
  lastFetched: null,
  filters: {},
};