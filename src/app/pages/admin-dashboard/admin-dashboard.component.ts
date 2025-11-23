import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CommandesService } from '../../services/commandes.service';
import { PanierComponent } from '../panier/panier.component';
import { PaiementService } from '../../services/paiement.service';
import { LivraisonService } from '../../services/livraison.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    RouterOutlet,
    NgChartsModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  chartType: ChartType = 'bar';
  currentUser: any;
  totalCommandes = 0;
  totalPaiements = 0;
  totalLivraisons = 0;

  commandesStatut: any = {};
  paiementsStatut: any = {};
  livraisonsStatut: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private commandeService: CommandesService,
    private paiementService: PaiementService,
    private livraisonService: LivraisonService
  ) {}
  searchQuery: string = '';
    onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Recherche:', this.searchQuery);
      // Implémenter la logique de recherche
      // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
  // on verifie le role de l'utilisateur
      if (user && user.role !== 'ADMIN') {
        this.router.navigate(['/unauthorized']);
      } else {
        this.statistiques();
      }
    });


    // Charger l'utilisateur si pas encore fait
    if (!this.currentUser && this.authService.isAuthenticated()) {
      this.authService.loadUser().subscribe();
    }
    this.statistiques();
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  isproducteur(): boolean {
    return this.authService.hasRole('PRO');
  }

  isClient(): boolean {
    return this.authService.hasRole('CLIENT');
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Même en cas d'erreur, on déconnecte localement
        this.authService.removeToken();
        this.router.navigate(['/login']);
      }
    });
  }
  statistiques() {
    this.commandeService.getAll().subscribe(data => {
      this.totalCommandes = data.length;
      this.commandesStatut = {
        preparation: data.filter(c => c.statut === 'EN_PREPARATION').length,
        prete: data.filter(c => c.statut === 'PRETE').length,
        livraison: data.filter(c => c.statut === 'EN_LIVRAISON').length,
        livree: data.filter(c => c.statut === 'LIVREE').length,
        annulee: data.filter(c => c.statut === 'ANNULEE').length,
      };
    });

    this.paiementService.getAll().subscribe(data => {
      this.totalPaiements = data.length;
      this.paiementsStatut = {
        payee: data.filter(p => p.statut === 'PAYEE').length,
        nonPayee: data.filter(p => p.statut !== 'PAYEE').length
      };
    });

    this.livraisonService.getAll().subscribe(data => {
      this.totalLivraisons = data.length;
      this.livraisonsStatut = {
        livree: data.filter(l => l.statut === 'livrée').length,
        nonLivree: data.filter(l => l.statut !== 'livrée').length
      };
    });
  }
}