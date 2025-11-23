import { CommonModule,CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Produit } from '../../models/produit';
import { ProduitService } from '../../services/produit.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../services/categorie.service';
import { ProducteurService } from '../../services/producteur.service';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    FormsModule
    
  ],
  templateUrl: './produitAdmin.component.html',
  styleUrl: './produitAdmin.component.css'
})
export class ProduitAdminComponent {
    activeTab: 'pending' | 'all' = 'pending';
  
  stats = {
  pending: 0,
  validatedToday: 0,
  rejectedToday: 0,
  total: 0
};

  // Data
  allProducts: Produit[] = [];
  pendingProducts: Produit[] = [];
  categories: any[] = [];
  viewModePending: 'table' | 'grid' = 'table';
  producers: any[] = [];

  // Filters
  searchQuery: string = '';
  filterCategory: string = '';
  sortBy: string = 'recent';

  searchQueryAll: string = '';
  filterProducer: string = '';
  filterCategoryAll: string = '';
  filterStatus: string = '';
  sortByAll: string = 'recent';

  // Filtered data
  filteredPendingProducts: Produit[] = [];
  filteredAllProducts: Produit[] = [];
  paginatedProducts: Produit[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;

  // View mode
  viewMode: 'table' | 'grid' = 'table';

  // Modal
  showDetailsModal: boolean = false;
  selectedProduct: Produit | null = null;

  constructor(
    private router: Router,
    private produiService: ProduitService,
    private categorieService: CategorieService,
    private producteurService: ProducteurService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }
  loadStats(): void {
  this.produiService.getStats().subscribe({
    next: (data) => {
      this.stats = data;
      console.log("Stats reçues :", data);
    },
    error: (err) => {
      console.error("Erreur stats :", err);
    }
  });
}

getValidationLabel(status: string): string {
  const labels: { [key: string]: string } = {
    'EN_ATTENTE': 'En attente',
    'VALIDE': 'Validé',
    'REFUSE': 'Refusé'
  };
  return labels[status] || status;
}

getInitials(name?: string): string {
  if (!name) return '??';
  return name.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

  loadData(): void {
    // Charger les produits en attente
    this.produiService.getAll().subscribe({
      next: (products) => {
        this.pendingProducts = products.filter(p => p.validationAdmin === 'EN_ATTENTE');;
        this.filteredPendingProducts = this.pendingProducts;
      },
      error: (error) => console.error('Erreur chargement produits en attente:', error)
    });

    // Charger tous les produits
    this.produiService.getAll().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.filteredAllProducts = products;
        this.updatePagination();
      },
      error: (error) => console.error('Erreur chargement tous produits:', error)
    });

    // Charger les catégories
    this.categorieService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => console.error('Erreur chargement catégories:', error)
    });

    // Charger les producteurs
    this.producteurService.getAll().subscribe({
      next: (producers) => {
        this.producers = producers;
        console.log('les producteurs');
        console.log(producers);
      },
      error: (error) => console.error('Erreur chargement producteurs:', error)
    });
  }

  switchTab(tab: 'pending' | 'all'): void {
    this.activeTab = tab;
  }

  // Pending Products Functions
  filterProducts(): void {
    let filtered = [...this.pendingProducts];

    if (this.searchQuery) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.filterCategory) {
      filtered = filtered.filter(p => p.categorie?.id === +this.filterCategory);
    }

    this.filteredPendingProducts = filtered;
    this.sortProducts();
  }

  sortProducts(): void {
    switch(this.sortBy) {
      case 'recent':
        this.filteredPendingProducts.sort((a, b) => 
          new Date(b.dateAjout!).getTime() - new Date(a.dateAjout!).getTime()
        );
        break;
      case 'oldest':
        this.filteredPendingProducts.sort((a, b) => 
          new Date(a.dateAjout!).getTime() - new Date(b.dateAjout!).getTime()
        );
        break;
      case 'name':
        this.filteredPendingProducts.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
    }
  }

  // All Products Functions
  filterAllProducts(): void {
    let filtered = [...this.allProducts];

    if (this.searchQueryAll) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(this.searchQueryAll.toLowerCase())
      );
    }

    if (this.filterProducer) {
      filtered = filtered.filter(p => p.producteur?.id === +this.filterProducer);
    }

    if (this.filterCategoryAll) {
      filtered = filtered.filter(p => p.categorie?.id === +this.filterCategoryAll);
    }

    if (this.filterStatus) {
      filtered = filtered.filter(p => p.validationAdmin === this.filterStatus);
    }

    this.filteredAllProducts = filtered;
    this.currentPage = 1;
    this.sortAllProducts();
  }

  sortAllProducts(): void {
    switch(this.sortByAll) {
      case 'recent':
        this.filteredAllProducts.sort((a, b) => 
          new Date(b.dateAjout!).getTime() - new Date(a.dateAjout!).getTime()
        );
        break;
      case 'name':
        this.filteredAllProducts.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'price-asc':
        this.filteredAllProducts.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-desc':
        this.filteredAllProducts.sort((a, b) => b.prix - a.prix);
        break;
    }
    this.updatePagination();
  }

  // Pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAllProducts.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredAllProducts.slice(startIndex, endIndex);
  }

  getImageUrl(image: string): string {
  return `http://localhost:8000/storage/${image}`;
}

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Actions
  validateProduct(product: Produit): void {
    if (confirm(`Voulez-vous valider le produit "${product.nom}" ?`)) {
      this.produiService.updateValidation(product.id, 'VALIDE').subscribe({
        next: () => {
          alert('Produit validé avec succès !');
          this.loadData();
          this.closeDetailsModal();
        },
        error: (error) => {
          console.error('Erreur validation produit:', error);
          alert('Une erreur est survenue lors de la validation.');
        }
      });
    }
  }

  rejectProduct(product: Produit): void {
    const reason = prompt('Raison du refus (optionnel):');
    if (reason !== null) {
      this.produiService.updateValidation(product.id, 'REFUSE').subscribe({
        next: () => {
          alert('Produit refusé.');
          this.loadData();
          this.closeDetailsModal();
        },
        error: (error) => {
          console.error('Erreur refus produit:', error);
          alert('Une erreur est survenue lors du refus.');
        }
      });
    }
  }

  viewProductDetails(product: Produit): void {
    this.selectedProduct = product;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedProduct = null;
  }

  editProduct(product: Produit): void {
    this.router.navigate(['/admin/produits/modifier', product.id]);
  }

  deleteProduct(product: Produit): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      this.produiService.deleteProduit(product.id).subscribe({
        next: () => {
          alert('Produit supprimé avec succès !');
          this.loadData();
        },
        error: (error) => {
          console.error('Erreur suppression produit:', error);
          alert('Une erreur est survenue lors de la suppression.');
        }
      });
    }
  }

  // Helpers
  getTimeAgo(date: Date): string {
    const now = new Date().getTime();
    const productDate = new Date(date).getTime();
    const diff = now - productDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`;
    return 'Récent';
  }
 
}