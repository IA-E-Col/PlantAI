export interface Annotation {
  id: number;
  specimenId: number;
  modelId: number;
  classId: number;
  prediction: string;
  confidence: number;
  status: 'pending' | 'validated' | 'rejected' | 'in_progress';
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  validatedBy?: number;
  validatedAt?: string;
  comments: Comment[];
  votes: Vote[];
  metadata?: {
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    features?: {
      color: string[];
      texture: string;
      shape: string;
    };
  };
}

export interface Comment {
  id: number;
  annotationId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export interface Vote {
  id: number;
  annotationId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  vote: 'approve' | 'reject';
  confidence: number;
  comment?: string;
  createdAt: string;
}

export interface ValidationStats {
  totalAnnotations: number;
  pendingAnnotations: number;
  validatedAnnotations: number;
  rejectedAnnotations: number;
  inProgressAnnotations: number;
  consensusRate: number;
  averageConfidence: number;
  validationProgress: number;
  lastValidationDate?: string;
}

export interface AnnotationFilters {
  status?: string[];
  modelId?: number;
  classId?: number;
  userId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  confidenceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

export interface AnnotationState {
  annotations: Annotation[];
  currentAnnotation: Annotation | null;
  comments: Comment[];
  votes: Vote[];
  validationStats: ValidationStats | null;
  filters: AnnotationFilters;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  sortBy: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export const initialAnnotationState: AnnotationState = {
  annotations: [],
  currentAnnotation: null,
  comments: [],
  votes: [],
  validationStats: null,
  filters: {},
  loading: false,
  error: null,
  lastUpdated: null,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  },
  sortBy: {
    field: 'createdAt',
    direction: 'desc'
  }
};
