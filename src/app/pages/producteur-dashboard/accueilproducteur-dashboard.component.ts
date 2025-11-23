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
@Component({
  selector: 'app-accueilproducteur-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgChartsModule
],
  templateUrl: './accueilproducteur-dashboard.component.html',
  styleUrl: './producteur-dashboard.component.css'
})
export class AccueilProducteurDashboardComponent {
// Données du producteur
  producteur = {
    nom: 'Jean Dupont',
    badges: ['Producteur Bio', 'Région Provence'],
    description: 'Bienvenue sur votre espace producteur. Gérez vos produits et promotions.'
  };

  // Statistiques
  stats = {
    ventesTotales: '€3500',
    ventesChange: '+10%',
    nouveauxClients: 25,
    clientsChange: '+2%',
    produitsStock: 150,
    stockChange: '-2%',
    promotionsActives: 3,
    promosChange: '+1'
  };

  // Produits
  produits = [
    { nom: 'Tomates Bio', emoji: '🍅', categorie: 'Produit de saison', prix: '3.50€/kg' },
    { nom: 'Carottes Bio', emoji: '🥕', categorie: 'Produit de saison', prix: '2.80€/kg' },
    { nom: 'Salade verte', emoji: '🥬', categorie: 'Produit de saison', prix: '1.50€/pièce' },
    { nom: 'Maïs doux Bio', emoji: '🌽', categorie: 'Produit phare', prix: '4.20€/kg' }
  ];

  // Promotions
  promotions = [
    {
      titre: '🎉 Offre Spéciale Été',
      description: 'Profitez de -15% sur tous les légumes de saison jusqu\'au 30 juin. Augmentez vos ventes avec cette offre attractive.'
    },
    {
      titre: '📅 Calendrier des récoltes',
      description: 'Tomates cerises : Dispo le 15/06<br>Courgettes : Dispo le 20/06<br>Melons : Dispo le 01/07'
    }
  ];

  searchQuery: string = '';

  constructor(private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initChart();
  }

  initChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Ventes (€)',
            data: [2200, 1800, 2800, 2400, 3200, 3500],
            borderColor: '#48bb78',
            backgroundColor: 'rgba(72, 187, 120, 0.05)',
            tension: 0.4,
            fill: true,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: '#48bb78',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#2d3748',
              padding: 12,
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#48bb78',
              borderWidth: 1
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              },
              ticks: {
                color: '#718096',
                callback: function(value) {
                  return '€' + value;
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#718096'
              }
            }
          }
        }
      });
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Recherche:', this.searchQuery);
      // Implémenter la logique de recherche
      // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  onLogout(): void {
    // Implémenter la logique de déconnexion
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Nettoyer le localStorage/sessionStorage
      localStorage.removeItem('token');
      // Rediriger vers la page de connexion
      this.router.navigate(['/login']);
    }
  }

  ajouterProduit(): void {
    this.router.navigate(['/producteur/addProduit']);
  }

  voirProfil(): void {
    this.router.navigate(['/profil']);
  }

  telechargerRapport(): void {
    console.log('Téléchargement du rapport...');
    // Implémenter la génération et le téléchargement du rapport PDF
  }

  voirDetails(): void {
    this.router.navigate(['/statistiques']);
  }

  voirTousProduits(): void {
    this.router.navigate(['/producteur/produit']);
  }

  creerPromotion(): void {
    this.router.navigate(['/producteur/addPromotion']);
  }}
