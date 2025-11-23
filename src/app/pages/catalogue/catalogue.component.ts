import { Component, OnInit } from '@angular/core';
import { Produit } from '../../models/produit';
import { PanierService } from '../../services/panier.service';
import { ProduitService } from '../../services/produit.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Promotion } from '../../models/promotion';
import { PromotionService } from '../../services/promotion.service';
import { ProducteurService } from '../../services/producteur.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
interface Product {
  id: number;
  name: string;
  image: string;
  weight: string;
  price: number;
  isNew: boolean;
  category: string;
  producerId: number;
  producerName: string;
  producerAvatar: string;
}


@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent implements OnInit{
  searchQuery: string = '';
  cartCount: number = 0;
   selectedCategory: string = '';
  displayedProducts: Product[] = [];
  allProducts: Product[] = [];
  productsPerPage: number = 12;
  currentPage: number = 1;
  totalProducts: number = 0;
  hasMoreProducts: boolean = true;

  // Tous les produits (exemple)
  products: Product[] = [
    {
      id: 1,
      name: 'La consommateur',
      image: 'assets/images/products/potato.jpg',
      weight: '1 kg',
      price: 2500,
      isNew: true,
      category: 'legumes',
      producerId: 1,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar1.jpg'
    },
    {
      id: 2,
      name: 'Gros Sénégalais',
      image: 'assets/images/products/sweet-potato.jpg',
      weight: '1 kg',
      price: 2000,
      isNew: false,
      category: 'legumes',
      producerId: 2,
      producerName: 'Autre producteur',
      producerAvatar: 'assets/images/producers/avatar2.jpg'
    },
    {
      id: 3,
      name: 'Toffe de saison',
      image: 'assets/images/products/pumpkin.jpg',
      weight: '1 unité',
      price: 1500,
      isNew: false,
      category: 'legumes',
      producerId: 1,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar1.jpg'
    },
    {
      id: 4,
      name: 'Mangue',
      image: 'assets/images/products/mango.jpg',
      weight: '1 kg',
      price: 3000,
      isNew: true,
      category: 'fruits',
      producerId: 3,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar3.jpg'
    },
    {
      id: 5,
      name: 'Pomme de terre',
      image: 'assets/images/products/vegetables.jpg',
      weight: '1 kg',
      price: 1500,
      isNew: false,
      category: 'legumes',
      producerId: 2,
      producerName: 'Autre producteur',
      producerAvatar: 'assets/images/producers/avatar2.jpg'
    },
    {
      id: 6,
      name: 'Pomme de terre',
      image: 'assets/images/products/bread.jpg',
      weight: '1 kg',
      price: 600,
      isNew: false,
      category: 'cereales',
      producerId: 4,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar4.jpg'
    },
    {
      id: 7,
      name: 'Oignon',
      image: 'assets/images/products/onion.jpg',
      weight: '1 kg',
      price: 800,
      isNew: false,
      category: 'legumes',
      producerId: 1,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar1.jpg'
    },
    {
      id: 8,
      name: 'Betrave',
      image: 'assets/images/products/beetroot.jpg',
      weight: '1 kg',
      price: 1500,
      isNew: false,
      category: 'legumes',
      producerId: 2,
      producerName: 'Autre producteur',
      producerAvatar: 'assets/images/producers/avatar2.jpg'
    },
    {
      id: 9,
      name: 'Piment rouge',
      image: 'assets/images/products/red-pepper.jpg',
      weight: '500 g',
      price: 1200,
      isNew: true,
      category: 'epices',
      producerId: 5,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar5.jpg'
    },
    {
      id: 10,
      name: 'Poivron coloré',
      image: 'assets/images/products/bell-pepper.jpg',
      weight: '1 kg',
      price: 2000,
      isNew: false,
      category: 'legumes',
      producerId: 3,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar3.jpg'
    },
    {
      id: 11,
      name: 'Ail blanc',
      image: 'assets/images/products/garlic.jpg',
      weight: '500 g',
      price: 900,
      isNew: false,
      category: 'epices',
      producerId: 1,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar1.jpg'
    },
    {
      id: 12,
      name: 'Haricot sec',
      image: 'assets/images/products/beans.jpg',
      weight: '1 kg',
      price: 1800,
      isNew: false,
      category: 'cereales',
      producerId: 4,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar4.jpg'
    },
    {
      id: 13,
      name: 'Carotte',
      image: 'assets/images/products/carrot.jpg',
      weight: '1 kg',
      price: 1200,
      isNew: true,
      category: 'legumes',
      producerId: 2,
      producerName: 'Autre producteur',
      producerAvatar: 'assets/images/producers/avatar2.jpg'
    },
    {
      id: 14,
      name: 'Concombre',
      image: 'assets/images/products/cucumber.jpg',
      weight: '1 kg',
      price: 800,
      isNew: false,
      category: 'legumes',
      producerId: 3,
      producerName: 'Producteur',
      producerAvatar: 'assets/images/producers/avatar3.jpg'
    },
    // Ajoutez plus de produits selon vos besoins
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.allProducts = [...this.products];
    this.totalProducts = this.allProducts.length;
    this.loadProducts();
  }
onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/catalogue'], { 
        queryParams: { search: this.searchQuery } 
      });
      this.searchQuery = '';
    }
  }
  loadProducts(): void {
    const startIndex = 0;
    const endIndex = this.productsPerPage * this.currentPage;
    this.displayedProducts = this.allProducts.slice(startIndex, endIndex);
    this.hasMoreProducts = endIndex < this.totalProducts;
  }
  mobileMenuOpen: boolean = false;
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  loadMoreProducts(): void {
    this.currentPage++;
    this.loadProducts();
  }

  filterByCategory(): void {
    if (this.selectedCategory) {
      this.allProducts = this.products.filter(p => p.category === this.selectedCategory);
    } else {
      this.allProducts = [...this.products];
    }
    this.totalProducts = this.allProducts.length;
    this.currentPage = 1;
    this.loadProducts();
  }

  toggleFilters(): void {
    // Ouvrir un modal ou un panneau de filtres
    console.log('Toggle filters');
  }

  addToCart(product: Produit): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.nom} ajouté au panier !`);
  }

  viewProducer(producerId: number): void {
    this.router.navigate(['/producteur', producerId]);
  }
}
