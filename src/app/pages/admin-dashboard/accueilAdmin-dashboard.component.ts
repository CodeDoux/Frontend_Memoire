import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartType, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { Categorie } from '../../models/categorie';
import { CategorieService } from '../../services/categorie.service';
import { CommandesService } from '../../services/commandes.service';
import { Commande } from '../../models/commande';
import { Produit } from '../../models/produit';
import { ProduitService } from '../../services/produit.service';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    NgChartsModule
],
  templateUrl: './accueilAdmin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AccueilAdminDashboardComponent implements OnInit {
  

  currentDate = new Date();
  notificationCount = 8;
  topCategories: Categorie[]=[];
  recentOrders: Commande[]=[];
  pendingProducts: Produit[]=[];
  error: string='';

 stats = {
  orders: 0,
  users: 0,
  pendingProducts: 0,
  deliveries: 0,
  pendingPromos: 0,
  pendingReviews: 0,
  categories: 0
};

  loadProduit(): void {
  
      this.produitService.getAll().subscribe({
        next: (data: Produit[]) => {
          this.pendingProducts = data;
          console.log('Produits récupérés:', data);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des produits:', error);
          
        }
      });
    }

    loadStats(): void {
  this.dashboardService.getStats().subscribe({
    next: data => {
      this.stats = data;
      console.log('Stats dynamiques :', data);
    },
    error: err => {
      console.error('Erreur stats :', err);
    }
  });
}
  

  loadCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (categories) => {
        this.topCategories = categories;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories.';
        console.error(err);
      }
    });
  }
  loadCommandes(){
        this.commandeService.getByClient().subscribe(
          (data : Commande[])=>{
            this.recentOrders = data;
            console.log(data);
          },
          (error)=>{
            console.log(error);
          }
        )
      }

  constructor(private router: Router,private commandeService: CommandesService, private categorieService: CategorieService, private produitService: ProduitService, private dashboardService: DashboardService) {
    Chart.register(...registerables);
  }
  getImageUrl(image: string): string {
  return `http://localhost:8000/storage/${image}`;
}

  ngOnInit(): void {
    this.initSalesChart();
    this.loadCategories();
    this.loadCommandes();
    this.loadProduit();
    this.loadStats();
  }

  initSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
          datasets: [
            {
              label: 'Ventes (Fr)',
              data: [45000, 52000, 48000, 61000],
              borderColor: '#48bb78',
              backgroundColor: 'rgba(72, 187, 120, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#48bb78',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointHoverRadius: 7
            },
            {
              label: 'Commandes',
              data: [120, 145, 135, 168],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointHoverRadius: 7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                  weight: '600'
                }
              }
            },
            tooltip: {
              backgroundColor: '#2d3748',
              padding: 12,
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#48bb78',
              borderWidth: 1,
              displayColors: false
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
                font: {
                  size: 11
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#718096',
                font: {
                  size: 11
                }
              }
            }
          }
        }
      });
    }
  }

  openNotifications(): void {
    // Ouvrir le panneau de notifications
    console.log('Ouvrir notifications');
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'processing': 'En cours',
      'delivered': 'Livré'
    };
    return labels[status] || status;
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/admin/commandes', orderId]);
  }

  validateProduct(productId: number): void {
  if (!confirm('Voulez-vous valider ce produit ?')) {
    return;
  }

  this.produitService.updateValidation(productId, 'VALIDE')
    .subscribe({
      next: () => {
        console.log('Produit validé:', productId);

        // Mise à jour locale de la liste
        this.pendingProducts = this.pendingProducts.filter(p => p.id !== productId);

        // Mise à jour des stats
        this.stats.pendingProducts--;

        alert('Produit validé avec succès !');
      },
      error: (err) => {
        console.error('Erreur de validation du produit :', err);
        alert('Erreur lors de la validation du produit.');
      }
    });
}


  rejectProduct(productId: number): void {
  if (!confirm('Voulez-vous refuser ce produit ?')) {
    return;
  }

  this.produitService.updateValidation(productId, 'REFUSE')
    .subscribe({
      next: () => {
        console.log('Produit refusé:', productId);

        this.pendingProducts = this.pendingProducts.filter(p => p.id !== productId);
        this.stats.pendingProducts--;

        alert('Produit refusé avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors du refus :', err);
        alert('Erreur lors du refus du produit.');
      }
    });
}
}