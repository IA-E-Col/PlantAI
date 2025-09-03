import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {ProjetService} from "../../services/projet.service";

@Component({
  selector: 'app-create-collection-modal',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './create-collection-modal.component.html',
  styleUrl: './create-collection-modal.component.css'
})
export class CreateCollectionModalComponent {

  // Variables pour stocker les informations de la collection
  nom: string = '';
  description: string = '';
  id: string = '';

  constructor(private route: ActivatedRoute , private router : Router ,private projetService : ProjetService) { }

  retour(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Méthode pour soumettre les informations de la collection
  soumettreCollection() {
    console.log('=== STARTING DATASET CREATION FLOW ===');
    console.log('Nom de la collection:', this.nom);
    console.log('Description de la collection:', this.description);
    this.projetService.dataset.name = this.nom
    this.projetService.dataset.description = this.description

    console.log('Current specimens in service:', this.projetService.specimens)
    console.log('Dataset object:', this.projetService.dataset)
    
    // Réinitialisez les champs après la soumission
    this.nom = '';
    this.description = '';
    this.id = this.projetService.projet.id;
    console.log('Project ID:', this.projetService.projet.id);
    
    // 1) Get the project's collection to fetch its specimens
    console.log('Step 1: Getting project collection...');
    this.projetService.func_get_collection_by_project(this.id).subscribe({
      next: (collection) => {
        console.log('Collection received:', collection);
        const collectionId = collection?.id;
        console.log('Collection ID extracted:', collectionId);
        
        if (!collectionId) {
          alert('No collection found for this project');
          return;
        }
        
        // 2) Fetch specimens from that collection
        console.log('Step 2: Fetching specimens from collection...');
        this.projetService.func_get_SpecimenByCollection(collectionId).subscribe({
          next: (specimens) => {
            console.log('Specimens received:', specimens);
            console.log('Number of specimens:', specimens?.length || 0);
            
            this.projetService.specimenstosend = specimens || [];
            console.log('Specimens set in service:', this.projetService.specimenstosend);
            
            // 3) Create dataset then attach specimens
            console.log('Step 3: Creating dataset...');
            this.projetService.func_add_Dataset(this.id).subscribe({
              next:(dataset)=>{
                console.log('Dataset created:', dataset);
                console.log('Dataset ID:', dataset.id);
                
                console.log('Step 4: Attaching specimens to dataset...');
                console.log('Specimens to attach:', this.projetService.specimenstosend);
                
                this.projetService.func_add_Specimens_To_Dataset(dataset.id).subscribe({
                  next:(result)=>{
                    console.log('Specimens attached successfully:', result);
                    console.log('=== DATASET CREATION COMPLETE ===');
                    this.router.navigate([`/admin/projects/${this.projetService.projet.id}/datasets`]);
                  }, error:(err)=>{
                    console.error('Failed to attach specimens to dataset:', err);
                    alert('Failed to attach specimens to dataset. Check console for details.');
                  }
                })
              },
              error:(err)=>{
                console.error('Dataset creation failed:', err);
                alert('Dataset not created. Check console for details.');
              }
            })
          },
          error: (err) => {
            console.error('Failed to load specimens from collection:', err);
            alert('Failed to load specimens from collection. Check console for details.');
          }
        })
      },
      error: (err) => {
        console.error('Failed to load project collection:', err);
        alert('Failed to load project collection. Check console for details.');
      }
    })
  }

}
