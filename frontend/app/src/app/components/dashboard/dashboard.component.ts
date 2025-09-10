import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables, ChartType, ChartTypeRegistry } from 'chart.js';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject, takeUntil, combineLatest, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { ProjectsActions, CollectionsActions, NavigationActions } from '../../store';
import { 
  selectProjectById,
  selectProjectsLoading,
  selectProjectsError 
} from '../../store/projects/projects.selectors';
import { 
  selectAllDatasets
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationProjectId
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Fixed typo here
})
export class DashboardComponent implements OnInit, OnDestroy {

  statistics = ['Genre', 'Family', 'Country', 'City', 'Department', 'Specific Epithet', 'Location', 'Scientific Name', 'Date'];
  chartTypesOptions = [
    { label: 'Select Chart Type', value: '' },
    { label: 'Line Chart', value: 'line' },
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Doughnut Chart', value: 'doughnut' },
    { label: 'Polar Area Chart', value: 'polarArea' }
  ];
  /*************************/
  specimens: Set<any> = new Set<any>();
  specimens_l: any;
  confusionMatrices: ConfusionMatrices = {};
  matrixColors: { [key: string]: string } = {};
  /*************************/

  // NgRx Observables
  project$: Observable<any>;
  projectId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Chart data
  datasets: any;
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
  
  private destroy$ = new Subject<void>();

  toggleActive() {
    /********************************/
    this.additionalChartTypes[10] = 'bar' as ChartType;
    this.renderAdditionalCharts();
    /********************************/
    this.isActive = true;
    this.isActive3 = true;
    this.isActive2 = false;
  }

  toggleActive2() {
    this.isActive = false;
    this.isActive2 = true;
    this.isActive3 = true;
  }

  toggleActive3() {
    this.isActive = true;
    this.isActive2 = true;
    this.isActive3 = false;
  }

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private store: Store<AppState>
  ) {
    this.chartTypes = this.initializeChartTypes(this.statistics.length);
    
    // Initialize NgRx observables
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.isLoading$ = this.store.select(selectProjectsLoading);
    this.error$ = this.store.select(selectProjectsError);
    
    // Create project observable from route params
    this.project$ = this.route.parent?.params.pipe(
      switchMap(params => {
        const projectId = params['id'];
        this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId }));
        return this.store.select(selectProjectById(parseInt(projectId)));
      })
    ) || this.store.select(selectProjectById(0));
  }

  initializeChartTypes(count: number): ChartType[] {
    const availableTypes: (keyof ChartTypeRegistry)[] = ['line', 'bar', 'pie', 'doughnut', 'polarArea'];
    return Array.from({ length: count }, (_, i) => availableTypes[i % availableTypes.length]);
  }

  ngOnInit(): void {
    this.loadChartDataNgRx();
    
    // Subscribe to errors for user feedback
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load dashboard data: ${error}`, 'error');
        }
      });
    
    console.log('Dashboard component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up charts
    this.currentCharts.forEach(chart => chart.destroy());
    this.additionalCharts.forEach(chart => chart.destroy());
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
  }

  loadChartDataNgRx(): void {
    this.project$
      .pipe(takeUntil(this.destroy$))
      .subscribe(project => {
        if (project) {
          console.log('Project loaded via NgRx:', project);
          
          // Load real datasets using NgRx action
          this.store.dispatch(CollectionsActions.loadDatasets({ projectId: project.id }));
          
          // Subscribe to real datasets data
          this.store.select(selectAllDatasets)
            .pipe(takeUntil(this.destroy$))
            .subscribe(datasets => {
              if (datasets && datasets.length > 0) {
                this.datasets = datasets;
                console.log('Real datasets loaded:', datasets.length);
                
                this.processStatistics().then(() => {
                  this.collectLibelleClassData().then(() => {
                    this.renderAllCharts();
                  });
                }).catch(error => {
                  console.error('Error processing statistics:', error);
                  Swal.fire('Error', 'Failed to process analytics data', 'error');
                });
              } else {
                console.log('No datasets found for project:', project.id);
                this.datasets = [];
                this.renderAllCharts(); // Render empty charts
              }
            });
        }
      });
  }

  // Mock data generation method removed - now using real API calls

  async processStatistics() {
    const statistics = ['genre', 'famille', 'pays', 'ville', 'departement', 'epitheteSpecifique', 'lieu', 'nomScientifique', 'dateCreation'];

    const requests = statistics.map(statistic => {
      let count: { [key: string]: number } = {};

      // Generate mock specimen data for demonstration
      return this.generateMockSpecimenData(statistic).then(specimens => {
        specimens.forEach((specimen: { [x: string]: any; }) => {
          let value = specimen[statistic];
          this.specimens.add(specimen);
          
          if (statistic === 'dateCreation' && value) {
            value = this.extractYear(value);
          }
          this.countOccurrences(value, count);
        });
      }).then(() => {
        const countArray = Object.entries(count).map(([key, value]) => ({ label: key, value }));
        /*************************/
        this.specimens_l = Array.from(this.specimens);
        console.log('this.specimens', this.specimens_l)
        this.confusionMatrices = this.generateConfusionMatrices(this.specimens_l);
        console.log('confusionMatrices', this.confusionMatrices)
        /*************************/
        if (statistic === 'dateCreation') {
          // Sort by value first
          countArray.sort((a, b) => b.value - a.value);

          // Slice the top 30 items
          const top30 = countArray.slice(0, 30);

          // Sort top30 by label
          top30.sort((a, b) => a.label.localeCompare(b.label));

          const other = countArray.slice(30);
          const otherCount = other.reduce((acc, curr) => acc + curr.value, 0);

          const labels = top30.map(item => item.label);
          const realdata = top30.map(item => item.value);
          const colordata = this.generateRandomColors(labels.length);

          if (other.length > 0) {
            labels.push('Other');
            realdata.push(otherCount);
            colordata.push('#CCCCCC');
          }

          const chartLabel = this.getChartLabel(statistic);
          this.chartData.push({ labels, realdata, colordata, chartLabel });
        } else {
          // Sort by value for other statistics
          countArray.sort((a, b) => b.value - a.value);

          const top7 = countArray.slice(0, 30);
          const other = countArray.slice(30);

          const otherCount = other.reduce((acc, curr) => acc + curr.value, 0);

          const labels = top7.map(item => item.label);
          const realdata = top7.map(item => item.value);
          const colordata = this.generateRandomColors(labels.length);

          if (other.length > 0) {
            labels.push('Other');
            realdata.push(otherCount);
            colordata.push('#CCCCCC');
          }

          const chartLabel = this.getChartLabel(statistic);
          this.chartData.push({ labels, realdata, colordata, chartLabel });
        }
      });
    });

    await Promise.all(requests);
  }

  async collectLibelleClassData() {
    const libelleCount: { [key: string]: { [key: string]: number } } = {};

    // Generate mock annotation data for demonstration
    const specimens = await this.generateMockAnnotationData();
    
    specimens.forEach((specimen: { annotations: any[]; }) => {
      specimen.annotations.forEach(annotation => {
        const { classe, libelle } = annotation;
        if (!libelleCount[libelle]) {
          libelleCount[libelle] = {};
        }
        libelleCount[libelle][classe] = (libelleCount[libelle][classe] || 0) + 1;
      });
    });

    Object.keys(libelleCount).forEach(libelle => {
      const count = libelleCount[libelle];
      const labels = Object.keys(count);
      const realdata = Object.values(count);
      const colordata = this.generateRandomColors(labels.length);

      this.additionalChartData.push({
        libelle,
        labels,
        realdata,
        colordata,
        chartLabel: `${libelle} Classes`
      });

      this.additionalChartTypes.push('bar'); // Default type for new charts
    });
  }

  generateRandomColors(count: number): string[] {
    return Array.from({ length: count }, () => this.getRandomColor());
  }

  updateChartType(event: any, index: number) {
    this.chartTypes[index] = event.target.value as ChartType;
    this.renderCharts();
  }

  updateAdditionalChartType(event: any, index: number) {
    this.additionalChartTypes[index] = event.target.value as ChartType;
    this.renderAdditionalCharts();
  }

  renderAllCharts() {
    this.renderCharts();
    this.renderAdditionalCharts();
  }

  renderCharts() {
    this.currentCharts.forEach(chart => chart.destroy());
    this.currentCharts = [];

    this.chartData.forEach((data, index) => {
      const chartId = 'chart' + (index + 1);
      const chart = new Chart(chartId, {
        type: this.chartTypes[index] || 'bar', // Ensure default type is set
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
          scales: this.isBarOrLineChart(this.chartTypes[index]) ? {
            y: {
              beginAtZero: true
            },
            x: {
              display: chartId !== 'chart6' && chartId !== 'chart8'
            }
          } : undefined
        }
      });

      this.currentCharts.push(chart);
    });
  }

  renderAdditionalCharts() {
    try {
      // Destroy existing charts and clear the array
      this.additionalCharts.forEach(chart => {
        try {
          chart.destroy();
        } catch (error) {
          console.error('Error destroying chart:', error);
        }
      });
      this.additionalCharts = [];

      // Loop through additional chart data and render each chart
      this.additionalChartData.forEach((data, index) => {
        try {
          const chartId = 'additionalChart' + (index + 1);
          const chartType = this.additionalChartTypes[index] || 'bar'; // Ensure default type is set

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
              scales: this.isBarOrLineChart(chartType) ? {
                y: {
                  beginAtZero: true
                }
              } : undefined
            }
          });

          this.additionalCharts.push(chart);
        } catch (error) {
          console.error(`Error rendering chart ${index + 1}:`, error);
        }
      });

      this.isLoad = false;
    } catch (error) {
      console.error('Error in renderAdditionalCharts method:', error);
      this.isLoad = false; // Ensure the loading state is correctly reset in case of failure
    }
  }

  countOccurrences(item: string, counter: { [key: string]: number }) {
    if (item) {
      counter[item] = (counter[item] || 0) + 1;
    }
  }

  extractYear(dateStr: string): string {
    const match = dateStr.match(/^\d{4}/);
    return match ? match[0] : '';
  }

  getChartLabel(statistic: string): string {
    const labels: { [key: string]: string } = {
      genre: 'Genre Numbers',
      famille: 'Famille Numbers',
      pays: 'Pays Numbers',
      ville: 'Ville Numbers',
      departement: 'Departement Numbers',
      epitheteSpecifique: 'EpitheteSpecifique Numbers',
      lieu: 'Lieu Numbers',
      nomScientifique: 'Nom Scientifique Numbers',
      dateCreation: 'Date Numbers'
    };
    return labels[statistic] || 'Unknown Statistic';
  }

  // Mock data generators for demonstration
  private async generateMockSpecimenData(statistic: string): Promise<any[]> {
    // Generate realistic mock data based on statistic type
    const mockData = [];
    const sampleSize = 100;
    
    for (let i = 0; i < sampleSize; i++) {
      const specimen: any = { id: i };
      
      switch (statistic) {
        case 'genre':
          specimen[statistic] = ['Rosa', 'Quercus', 'Pinus', 'Fagus', 'Betula'][Math.floor(Math.random() * 5)];
          break;
        case 'famille':
          specimen[statistic] = ['Rosaceae', 'Fagaceae', 'Pinaceae', 'Betulaceae'][Math.floor(Math.random() * 4)];
          break;
        case 'pays':
          specimen[statistic] = ['France', 'Spain', 'Italy', 'Germany', 'UK'][Math.floor(Math.random() * 5)];
          break;
        case 'ville':
          specimen[statistic] = ['Paris', 'Madrid', 'Rome', 'Berlin', 'London'][Math.floor(Math.random() * 5)];
          break;
        case 'dateCreation':
          specimen[statistic] = (2020 + Math.floor(Math.random() * 4)).toString();
          break;
        default:
          specimen[statistic] = `Sample ${statistic} ${i % 10}`;
      }
      
      mockData.push(specimen);
    }
    
    return Promise.resolve(mockData);
  }

  private async generateMockAnnotationData(): Promise<any[]> {
    const specimens = [];
    const annotations = [
      { libelle: 'Leaf Shape', classe: 'Oval' },
      { libelle: 'Leaf Shape', classe: 'Round' },
      { libelle: 'Flower Color', classe: 'Red' },
      { libelle: 'Flower Color', classe: 'Blue' },
      { libelle: 'Plant Height', classe: 'Tall' },
      { libelle: 'Plant Height', classe: 'Short' }
    ];
    
    for (let i = 0; i < 50; i++) {
      specimens.push({
        id: i,
        annotations: [annotations[Math.floor(Math.random() * annotations.length)]]
      });
    }
    
    return Promise.resolve(specimens);
  }

  isBarOrLineChart(chartType: ChartType): boolean {
    return chartType === 'bar' || chartType === 'line';
  }


  /*********************************************************************************/
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
    const classCounts1 = new Map<string, number>(); // Count for each class in model1
    const classCounts2 = new Map<string, number>(); // Count for each class in model2
    let totalSpecimensWithBothAnnotations = 0; // Total specimens with both annotations
  
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
        const total = totalSpecimensWithBothAnnotations || 1; // Avoid division by zero
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
    // Obtenir les clés de l'objet principal
    const keys = Object.keys(obj);

    // Vérifier si l'objet contient au moins une clé
    if (keys.length === 0) {
      return []; // Retourner un tableau vide si l'objet est vide
    }

    // Obtenir la première clé de l'objet principal
    const firstKey = keys[0];

    // Obtenir le dictionnaire associé à la première clé
    const firstDictionary = obj[firstKey];

    // Obtenir les clés du premier dictionnaire et les trier par ordre alphabétique
    const dictionaryKeys = Object.keys(firstDictionary).sort();

    return dictionaryKeys;
  }

  getValuesSortedByKey(clas: Record<string, any>): any[] {
    // Obtenir les clés du dictionnaire
    const keys = Object.keys(clas);

    // Trier les clés par ordre alphabétique
    keys.sort();

    // Obtenir les valeurs correspondant aux clés triées
    const sortedValues = keys.map(key => clas[key]);
    return sortedValues;
  }

  // Méthode pour générer une couleur aléatoire en format rgba
  getRandomColorM(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b},`;
  }

  // Méthode pour obtenir une clé unique basée sur les deux clés
  getUniqueKey(matrixKey: string, modelKey: string): string {
    return `${matrixKey}-${modelKey}`;
  }

  // Méthode pour obtenir la couleur de fond en fonction des deux clés et de la valeur
  getBackgroundColor(matrixKey: string, modelKey: string, val: number): string {
    const uniqueKey = this.getUniqueKey(matrixKey, modelKey);

    // Si la couleur n'est pas encore définie pour cette combinaison de clés, en créer une nouvelle
    if (!this.matrixColors[uniqueKey]) {
      this.matrixColors[uniqueKey] = this.getRandomColorM();
    }

    const baseColor = this.matrixColors[uniqueKey];
    const alpha = val / 100; // Convertir le pourcentage en alpha
    return `${baseColor}${alpha})`; // Retourne la couleur au format rgba
  }
  /*********************************************************************************/
}
