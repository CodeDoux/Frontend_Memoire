import { CommonModule,CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Produit } from '../../models/produit';
import { ProduitService } from '../../services/produit.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    FormsModule
    
  ],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.css'
})
export class ProduitComponent {
   currentFilter: string = 'all';
  sortBy: string = 'recent';
produits: Produit[] = [];
isLoading: boolean=false;
error: string | null = null;  
  filteredProducts: Produit[] = [];
  validatedProducts: number = 0;
  pendingProducts: number = 0;
  totalProducts: number = 0;


  constructor(
    private produitService: ProduitService,
    private authService: AuthService,
    public router: Router
  ) {}
  getBaseRoute(): string {
  if (this.authService.hasRole('ADMIN')) {
    return '/admin';
  } else if (this.authService.hasRole('PRO')) {
    return '/producteur';
  }
  return '';
}

  ngOnInit(): void {
    this.calculateStats();
    this.filterProducts('all');
    this.getAll();
  }

  calculateStats(): void {
    this.totalProducts = this.produits.length;
    this.validatedProducts = this.produits.filter(p => p.validationAdmin==='VALIDE').length;
    this.pendingProducts = this.produits.filter(p => !(p.validationAdmin==='VALIDE')).length;
  }
   filterProducts(filter: string): void {
    this.currentFilter = filter;
    
    switch(filter) {
      case 'validated':
        this.filteredProducts = this.produits.filter(p => p.validationAdmin==='VALIDE');
        break;
      case 'pending':
        this.filteredProducts = this.produits.filter(p => !(p.validationAdmin==='VALIDE'));
        break;
      default:
        this.filteredProducts = [...this.produits];
    }
    
    this.sortProducts();
  }

  sortProducts(): void {
    switch(this.sortBy) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.prix - a.prix);
        break;
      case 'recent':
      default:
        this.filteredProducts.sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime());
    }
  }
   addNewProduct(): void {
    this.router.navigate(['/producteur/addProduit']);
  }
  isValid(produit: Produit)
  {
    return produit['validationAdmin']==='VALIDE';
  }

  editProduct(produit: Produit): void {
    this.router.navigate(['/producteur/produits/modifier', produit.id]);
  }

  deleteProduct(produit: Produit): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${produit.nom}" ?`)) {
      this.produits = this.produits.filter(p => p.id !== produit.id);
      this.calculateStats();
      this.filterProducts(this.currentFilter);
      alert('Produit supprimé avec succès !');
    }
  }

  manageProduct(produit: Produit): void {
    this.router.navigate(['/producteur/produits/gerer', produit.id]);
  }

  getEmptyMessage(): string {
    switch(this.currentFilter) {
      case 'validated':
        return 'Vous n\'avez pas encore de produits validés.';
      case 'pending':
        return 'Aucun produit en attente de validation.';
      default:
        return 'Commencez par ajouter votre premier produit.';
    }
  }

  getImageUrl(image: string): string {
  return `http://localhost:8000/storage/${image}`;
}


  getAll(): void {
    this.isLoading = true;
    this.error = null;

    this.produitService.getAllByProducteur().subscribe({
      next: (data: Produit[]) => {
        this.produits = data;
        this.filteredProducts=this.produits;
        this.isLoading = false;
        console.log('Produits récupérés:', data);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la récupération des produits:', error);
        
      }
    });
  }

 
}