import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables, ChartType, ChartTypeRegistry } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { NgxPaginationModule } from 'ngx-pagination';
import { catchError } from 'rxjs/operators';
import { of, Subscription, Observable, Subject, takeUntil } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectAllCollections,
  selectCollectionsLoading,
  selectCollectionsError 
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationCollectionId
} from '../../store/navigation/navigation.selectors';

Chart.register(...registerables);

interface ConfusionMatrix {
  [key: string]: {
    [key: string]: number;
  };
}

interface ConfusionMatrices {
  [model1: string]: {
    [model2: string]: ConfusionMatrix;
  };
}

@Component({
  selector: 'app-collection-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './collection-dashboard.component.html',
  styleUrl: './collection-dashboard.component.css'
})
export class CollectionDashboardComponent implements OnInit, OnDestroy {

  statistics = ['Genre', 'Family', 'Country', 'City', 'Department', 'Specific Epithet', 'Location', 'Scientific Name', 'Date'];
  chartTypesOptions = [
    { label: 'Select Chart Type', value: '' },
    { label: 'Line Chart', value: 'line' },
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Doughnut Chart', value: 'doughnut' },
    { label: 'Polar Area Chart', value: 'polarArea' }
  ];
  
  // NgRx Observables
  collections$: Observable<any[]>;
  collectionsLoading$: Observable<boolean>;
  collectionsError$: Observable<string | null>;
  collectionId$: Observable<string | null>;

  // Component properties
  specimensl: Set<any> = new Set<any>();
  specimens_l: any;
  confusionMatrices: ConfusionMatrices = {};
  matrixColors: { [key: string]: string } = {};

  datasets: any;
  collectionId: any;
  specimens: any;
  errorMessage!: string;
  private routeSub!: Subscription;
  private destroy$ = new Subject<void>();

  chartData: { labels: string[], realdata: number[], colordata: string[], chartLabel: string }[] = [];
  additionalChartData: { libelle: string, labels: string[], realdata: number[], colordata: string[], chartLabel: string }[] = [];
  currentCharts: Chart[] = [];
  additionalCharts: Chart[] = [];
  chartTypes: ChartType[] = [];
  additionalChartTypes: ChartType[] = [];

  isActive: boolean = false;
  isActive2: boolean = true;
  isActive3: boolean = true;
  isLoad: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.collections$ = this.store.select(selectAllCollections);
    this.collectionsLoading$ = this.store.select(selectCollectionsLoading);
    this.collectionsError$ = this.store.select(selectCollectionsError);
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
    this.chartTypes = this.initializeChartTypes(this.statistics.length);
  }

  ngOnInit(): void {
    // Subscribe to error state
    this.collectionsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          console.error('Collections error:', error);
        }
      });

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.collectionId = params['id'];
        if (this.collectionId) {
          this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: this.collectionId }));
          this.loadCollectionData(this.collectionId);
        }
      });
    this.loadChartData();
    console.log('Collection-dashboard component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  toggleActive() {
    this.additionalChartTypes[10] = 'bar' as ChartType;
    this.renderAdditionalCharts();
    this.isActive = true;
    this.isActive3 = true;
  }

  toggleActive2() {
    this.isActive2 = !this.isActive2;
  }

  toggleActive3() {
    this.isActive3 = !this.isActive3;
  }

  initializeChartTypes(count: number): ChartType[] {
    const types: ChartType[] = [];
    for (let i = 0; i < count; i++) {
      types.push('bar');
    }
    return types;
  }

  loadCollectionData(collectionId: string): void {
    // Mock data for now
    const mockCollection = this.generateMockCollection(collectionId);
    console.log('Loaded collection data:', mockCollection);
  }

  generateMockCollection(collectionId: string): any {
    return {
      id: collectionId,
      name: `Collection ${collectionId}`,
      description: `Mock collection ${collectionId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  generateMockSpecimens(): any[] {
    return [
      {
        id: 1,
        nomScientifique: 'Rosa canina',
        famille: 'Rosaceae',
        genre: 'Rosa',
        epitheteSpecifique: 'canina',
        pays: 'France',
        ville: 'Paris',
        departement: 'Paris',
        localisation: 'Jardin des Plantes',
        dateRecolte: '2023-06-15',
        annotations: [
          { libelle: 'Model1', classe: 'Species' },
          { libelle: 'Model2', classe: 'Genus' }
        ]
      },
      {
        id: 2,
        nomScientifique: 'Quercus robur',
        famille: 'Fagaceae',
        genre: 'Quercus',
        epitheteSpecifique: 'robur',
        pays: 'France',
        ville: 'Lyon',
        departement: 'Rhône',
        localisation: 'Parc de la Tête d\'Or',
        dateRecolte: '2023-07-20',
        annotations: [
          { libelle: 'Model1', classe: 'Species' },
          { libelle: 'Model2', classe: 'Species' }
        ]
      }
    ];
  }

  loadChartData(): void {
    // Mock data for charts
    const mockSpecimens = this.generateMockSpecimens();
    
    this.chartData = this.statistics.map(statistic => {
      const labels = [...new Set(mockSpecimens.map(specimen => specimen[statistic.toLowerCase()] || 'Unknown'))];
      const realdata = labels.map(label => 
        mockSpecimens.filter(specimen => (specimen[statistic.toLowerCase()] || 'Unknown') === label).length
      );
      const colordata = labels.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`);
      
      return {
        labels,
        realdata,
        colordata,
        chartLabel: statistic
      };
    });

    this.renderCharts();
  }

  renderCharts(): void {
    try {
      // Destroy any existing charts
      this.currentCharts.forEach(chart => chart.destroy());
      this.currentCharts = [];

      // Loop through the chart data and render each chart
      this.chartData.forEach((data, index) => {
        try {
          const chartId = 'chart' + (index + 1);
          const chartType = this.chartTypes[index] || 'bar';

          const chart = new Chart(chartId, {
            type: chartType,
            data: {
              labels: data.labels,
              datasets: [{
                label: data.chartLabel,
                data: data.realdata,
                backgroundColor: data.colordata,
              }]
            },
            options: {
              animation: {
                duration: 1000,
                easing: 'easeInOutQuad',
              },
              plugins: {
                legend: {
                  display: true,
                  align: 'start',
                  position: 'top',
                  labels: {
                    boxWidth: 9,
                    padding: 0.5,
                    font: {
                      size: 9,
                    }
                  }
                }
              },
              scales: chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'polarArea' ? {
                y: {
                  beginAtZero: true
                },
                x: {
                  display: true
                }
              } : undefined
            }
          });

          this.currentCharts.push(chart);
        } catch (error) {
          console.error(`Error rendering chart ${index + 1}:`, error);
        }
      });
    } catch (error) {
      console.error('Error in renderCharts method:', error);
    }
  }

  renderAdditionalCharts(): void {
    try {
      // Destroy any existing charts
      if (this.additionalCharts) {
        this.additionalCharts.forEach((chart: any) => chart.destroy());
        this.additionalCharts = [];
      }

      // Loop through the additional chart data and render each chart
      if (this.additionalChartData) {
        this.additionalChartData.forEach((data: any, index: number) => {
          try {
            const chartId = 'additionalChart' + (index + 1);
            const chartType = this.additionalChartTypes?.[index] || 'bar';

            const chart = new Chart(chartId, {
              type: chartType,
              data: {
                labels: data.labels,
                datasets: [{
                  label: data.chartLabel,
                  data: data.realdata,
                  backgroundColor: data.colordata,
                }]
              },
              options: {
                animation: {
                  duration: 1000,
                  easing: 'easeInOutQuad',
                },
                plugins: {
                  legend: {
                    display: true,
                    align: 'start',
                    position: 'top',
                    labels: {
                      boxWidth: 9,
                      padding: 0.5,
                      font: {
                        size: 9,
                      }
                    }
                  }
                },
                scales: chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'polarArea' ? {
                  y: {
                    beginAtZero: true
                  },
                  x: {
                    display: true
                  }
                } : undefined
              }
            });

            if (this.additionalCharts) {
              this.additionalCharts.push(chart);
            }
          } catch (error) {
            console.error(`Error rendering chart ${index + 1}:`, error);
          }
        });
      }

      this.isLoad = false;
    } catch (error) {
      console.error('Error in renderAdditionalCharts method:', error);
    }
  }

  getChartLabel(statistic: string): string {
    return statistic.charAt(0).toUpperCase() + statistic.slice(1);
  }

  isBarOrLineChart(chartType: ChartType): boolean {
    return chartType === 'bar' || chartType === 'line';
  }

  getUniqueModels(specimens: any[]): string[] {
    const models = new Set<string>();
    specimens.forEach(specimen => {
      specimen.annotations.forEach((annotation: { libelle: string; }) => {
        models.add(annotation.libelle);
      });
    });
    return Array.from(models);
  }

  countCorrespondences(specimens: any[], model1: string, model2: string): ConfusionMatrix {
    const matrix: ConfusionMatrix = {};

    // Get unique classes for both models
    const uniqueClasses1 = new Set<string>();
    const uniqueClasses2 = new Set<string>();
    const classCounts1 = new Map<string, number>();
    const classCounts2 = new Map<string, number>();
    let totalSpecimensWithBothAnnotations = 0;

    // First pass: Collect unique classes and counts, and count specimens with both annotations
    specimens.forEach(specimen => {
      const hasModel1Annotation = specimen.annotations.some((ann: { libelle: string }) => ann.libelle === model1);
      const hasModel2Annotation = specimen.annotations.some((ann: { libelle: string }) => ann.libelle === model2);

      if (hasModel1Annotation && hasModel2Annotation) {
        totalSpecimensWithBothAnnotations++;
      }

      specimen.annotations.forEach((annotation: { libelle: string; classe: string }) => {
        if (annotation.libelle === model1) {
          uniqueClasses1.add(annotation.classe);
          classCounts1.set(annotation.classe, (classCounts1.get(annotation.classe) || 0) + 1);
        }
        if (annotation.libelle === model2) {
          uniqueClasses2.add(annotation.classe);
          classCounts2.set(annotation.classe, (classCounts2.get(annotation.classe) || 0) + 1);
        }
      });
    });

    // Ensure the presence of "Non" classes if only one class is present
    if (uniqueClasses1.size === 1) {
      const [uniqueClass1] = uniqueClasses1;
      uniqueClasses1.add(`Non${uniqueClass1}`);
    }

    if (uniqueClasses2.size === 1) {
      const [uniqueClass2] = uniqueClasses2;
      uniqueClasses2.add(`Non${uniqueClass2}`);
    }

    // Initialize the matrix with zero counts
    uniqueClasses1.forEach(classe1 => {
      matrix[classe1] = {};
      uniqueClasses2.forEach(classe2 => {
        matrix[classe1][classe2] = 0;
      });
    });

    // Count correspondences
    specimens.forEach(specimen => {
      const annotation1 = specimen.annotations.find((ann: { libelle: string; }) => ann.libelle === model1);
      const annotation2 = specimen.annotations.find((ann: { libelle: string; }) => ann.libelle === model2);

      if (annotation1 && annotation2) {
        matrix[annotation1.classe][annotation2.classe]++;
      }
    });

    // Convert counts to percentages and round to two decimal places
    uniqueClasses1.forEach(classe1 => {
      uniqueClasses2.forEach(classe2 => {
        const count = matrix[classe1][classe2];
        const total = totalSpecimensWithBothAnnotations || 1;
        matrix[classe1][classe2] = parseFloat((count / total * 100).toFixed(2));
      });
    });

    return matrix;
  }

  generateConfusionMatrices(specimens: any[]): ConfusionMatrices {
    const models = this.getUniqueModels(specimens);
    const matrices: ConfusionMatrices = {};

    for (let i = 0; i < models.length; i++) {
      for (let j = i + 1; j < models.length; j++) {
        const model1 = models[i];
        const model2 = models[j];
        const matrix = this.countCorrespondences(specimens, model1, model2);
        if (!matrices[model1]) {
          matrices[model1] = {};
        }
        matrices[model1][model2] = matrix;
      }
    }

    return matrices;
  }

  getKeysOfFirstDictionary(obj: Record<string, Record<string, number>>): string[] {
    const keys = Object.keys(obj);

    if (keys.length === 0) {
      return [];
    }

    const firstKey = keys[0];
    const firstDictionary = obj[firstKey];
    const dictionaryKeys = Object.keys(firstDictionary).sort();

    return dictionaryKeys;
  }

  getValuesSortedByKey(clas: Record<string, any>): any[] {
    const keys = Object.keys(clas);
    keys.sort();
    const sortedValues = keys.map(key => clas[key]);
    return sortedValues;
  }

  getRandomColorM(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b},`;
  }

  getUniqueKey(matrixKey: string, modelKey: string): string {
    return `${matrixKey}-${modelKey}`;
  }

  getBackgroundColor(matrixKey: string, modelKey: string, val: number): string {
    const uniqueKey = this.getUniqueKey(matrixKey, modelKey);

    if (!this.matrixColors[uniqueKey]) {
      this.matrixColors[uniqueKey] = this.getRandomColorM();
    }

    const baseColor = this.matrixColors[uniqueKey];
    const alpha = val / 100;
    return `${baseColor}${alpha})`;
  }

  updateChartType(event: Event, index: number): void {
    const target = event.target as HTMLSelectElement;
    const newType = target.value as ChartType;
    this.chartTypes[index] = newType;
    this.renderCharts();
  }

  updateAdditionalChartType(event: Event, index: number): void {
    const target = event.target as HTMLSelectElement;
    const newType = target.value as ChartType;
    this.additionalChartTypes[index] = newType;
    this.renderAdditionalCharts();
  }
}