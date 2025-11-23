import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProducteurService } from '../../services/producteur.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producteur } from '../../models/producteur';

@Component({
  selector: 'app-producteur',
  standalone: true,   // ✅ Indique que c’est standalone
  imports: [CommonModule, FormsModule,RouterModule], // ✅ Ajouter FormsModule ici
  templateUrl: './producteur.component.html',
  styleUrls: ['./producteur.component.css']
})
export class ProducteurComponent implements OnInit {
  producteurs: Producteur[] = [];
  
  isLoading = false;
  errorMessage = '';

  constructor(private producteurService: ProducteurService) {}

  ngOnInit(): void {
    this.chargerProducteurs();
  }

  chargerProducteurs() {
    this.isLoading = true;
    this.producteurService.getAll().subscribe({
      next: (data) => {
        this.producteurs = data;
        this.isLoading = false;
        console.log(this.producteurs);
      },
      error: (err) => {
        this.errorMessage = 'Erreur de chargement des producteurs';
        console.error(err);
        this.isLoading = false;
      }
    });
  }


  supprimerProducteur(id:number) {
    if (confirm('Voulez-vous vraiment supprimer ce producteur ?')) {
      this.producteurService.deleteProducteur(id).subscribe({
        next: () => {
          this.producteurs = this.producteurs.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Erreur suppression producteur', err);
        }
      });
    }
  }
}
