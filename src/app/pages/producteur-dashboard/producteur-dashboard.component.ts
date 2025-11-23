import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { CommandesService } from '../../services/commandes.service';
import { PaiementService } from '../../services/paiement.service';
import { LivraisonService } from '../../services/livraison.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { PanierService } from '../../services/panier.service';
@Component({
  selector: 'app-producteur-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterOutlet,
    NgChartsModule,
    RouterLink
],
  templateUrl: './producteur-dashboard.component.html',
  styleUrl: './producteur-dashboard.component.css'
})
export class ProducteurDashboardComponent {
  constructor(
      private authService: AuthService,
      private router: Router
    ) {}
    searchQuery: string = '';
    onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Recherche:', this.searchQuery);
      // Implémenter la logique de recherche
      // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        // Rediriger quand même vers login même en cas d'erreur
        this.router.navigate(['/login']);
      }
    });
  }
}
