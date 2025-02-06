import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-annotation-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annotation-validation.component.html',
  styleUrl: './annotation-validation.component.css'
})
export class AnnotationValidationComponent {
  annotation = {
    imageUrl: 'http://riha.african-herbaria.org/img/parts/TOGO/TOGO04291.jpg',
    class: 'Sol/Pas Sol',
    prediction: 'Sol'
  };

  votes = {
    inFavor: 75,
    against: 25,
    inFavorUsers: [
      { name: 'Jane Doe', avatar: 'https://th.bing.com/th/id/R.737c59144b9b2f046b6cc535c365b5bb?rik=Z1jk4d3OWIfoOw&pid=ImgRaw&r=0' },
      { name: 'Paula Poe', avatar: 'https://th.bing.com/th/id/OIP.Xe0FlT8qEGLqyrrIbv2P9wHaF7?rs=1&pid=ImgDetMain' }
    ],
    againstUsers: [
      { name: 'John Doe', avatar: 'https://th.bing.com/th/id/OIP.IrUBHhdMo6wWLFueKNreRwHaHa?rs=1&pid=ImgDetMain' }
    ]
  };

  comments = [
    {
      name: 'John Doe',
      text: 'À mon avis, il y a quelques problèmes avec cette prédiction, ce spécimen ne vérifie pas cette propriété.',
      avatar: 'https://th.bing.com/th/id/OIP.IrUBHhdMo6wWLFueKNreRwHaHa?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Jane Doe',
      text: 'Non, la prédiction vérifie parfaitement les propriétés du spécimen. Je te recommande de vérifier la Distribution de la plante et ses propriétés à travers la "Model Library".',
      avatar: 'https://th.bing.com/th/id/R.737c59144b9b2f046b6cc535c365b5bb?rik=Z1jk4d3OWIfoOw&pid=ImgRaw&r=0'
    },
    {
      name: 'Paula Poe',
      text: 'C’est vrai. Au niveau de la Model Library on peut parfaitement voir les que les informations sont conformes à ce qui a été retourné par le modèle.',
      avatar: 'https://th.bing.com/th/id/OIP.Xe0FlT8qEGLqyrrIbv2P9wHaF7?rs=1&pid=ImgDetMain'
    }
  ];

  submitValidation() {
    console.log('Validation submitted');
  }
}
