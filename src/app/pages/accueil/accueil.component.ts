import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommandesService } from '../../services/commandes.service';
import { PaiementService } from '../../services/paiement.service';
import { LivraisonService } from '../../services/livraison.service';
import { ProduitService } from '../../services/produit.service';
import { UserService } from '../../services/user.service';
import { Observable, of, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProducteurService } from '../../services/producteur.service';
import { Produit } from '../../models/produit';
import { Producteur } from '../../models/producteur';
import { PanierComponent } from '../panier/panier.component';
import { PanierService } from '../../services/panier.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
})
export class AccueilComponent implements OnInit {
  searchQuery: string = '';
  cartCount: number = 0;
  produits: Produit[]=[];
  mobileMenuOpen: boolean = false;


  products = [
    { id: 1, name: 'Gros Sénégalais', image: 'assets/images/products/potato.jpg', weight: '1 kg', price: 2500 },
    { id: 2, name: 'Toffe de saison', image: 'assets/images/products/pumpkin.jpg', weight: '1 kg', price: 1500 },
    { id: 3, name: 'Corete', image: 'assets/images/products/green-beans.jpg', weight: '500 g', price: 1000 },
    { id: 4, name: 'Mangue', image: 'assets/images/products/mango.jpg', weight: '1 kg', price: 1500 },
    { id: 5, name: 'Pomme de terre', image: 'assets/images/products/bread.jpg', weight: '1 kg', price: 600 },
    { id: 6, name: 'Oignon', image: 'assets/images/products/onion.jpg', weight: '1 kg', price: 550 },
    { id: 7, name: 'Raisin', image: 'assets/images/products/grape.jpg', weight: '500 g', price: 450 },
    { id: 8, name: 'Betrave', image: 'assets/images/products/beetroot.jpg', weight: '1 kg', price: 700 }
  ];

  producers = [
    {
      id: 1,
      name: 'Ferme Bio du Soleil',
      location: 'Provence, France',
      specialty: 'Fruits et légumes bio de saison cultivés dans le respect de l\'environnement',
      image: 'assets/images/producers/farm1.jpg'
    },
    {
      id: 2,
      name: 'Les Jardins de Marie',
      location: 'Bretagne, France',
      specialty: 'Production artisanale de légumes anciens et variétés rares',
      image: 'assets/images/producers/farm2.jpg'
    },
    {
      id: 3,
      name: 'Maraîchage Dupont',
      location: 'Normandie, France',
      specialty: 'Exploitation familiale spécialisée dans les légumes de terroir',
      image: 'assets/images/producers/farm3.jpg'
    }
  ];

  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private router: Router, private produitService: ProduitService, private panierService: PanierService) { }

  ngOnInit(): void {
    this.loadCartCount();
    this.loadProduits();
  }
  loadProduits() {
    this.produitService.getAll().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits:', err);
      }
    });
  }


  addToCart(produit: any): void {
    if (!this.panierService.estDansPanier(produit.id)) {
      this.panierService.ajouterProduit(produit, 1);
      
      // Animation de confirmation (optionnel)
      const button = event?.target as HTMLElement;
      if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      }
    }
  }

  getImageUrl(image: string): string {
  return `http://localhost:8000/storage/${image}`;
}

  viewProducer(producerId: number): void {
    this.router.navigate(['/producteur', producerId]);
  }
  loadCartCount(): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/catalogue'], { 
        queryParams: { search: this.searchQuery } 
      });
      this.searchQuery = '';
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  testimonials = [
    {
      id: 1,
      name: 'Sophie Martin',
      initials: 'SM',
      rating: 5,
      text: 'Excellente plateforme ! Les produits sont toujours frais et la livraison est rapide. Je recommande vivement Circuit Court pour soutenir nos producteurs locaux.',
      date: 'Il y a 2 jours',
      verified: true
    },
    {
      id: 2,
      name: 'Pierre Dubois',
      initials: 'PD',
      rating: 5,
      text: 'J\'adore pouvoir acheter directement chez les producteurs. Les prix sont justes et la qualité est au rendez-vous. Bravo pour cette initiative !',
      date: 'Il y a 1 semaine',
      verified: true
    },
    {
      id: 3,
      name: 'Marie Laurent',
      initials: 'ML',
      rating: 4,
      text: 'Très bonne expérience. Les légumes sont délicieux et on sent vraiment la différence avec ceux du supermarché. La plateforme est facile à utiliser.',
      date: 'Il y a 2 semaines',
      verified: true
    },
    {
      id: 4,
      name: 'Thomas Bernard',
      initials: 'TB',
      rating: 5,
      text: 'Circuit Court a changé ma façon de consommer. Je connais maintenant mes producteurs et je mange mieux. C\'est parfait !',
      date: 'Il y a 3 semaines',
      verified: true
    },
    {
      id: 5,
      name: 'Isabelle Moreau',
      initials: 'IM',
      rating: 5,
      text: 'Service impeccable ! Les producteurs sont passionnés et ça se voit dans leurs produits. Je suis devenue cliente régulière.',
      date: 'Il y a 1 mois',
      verified: true
    },
    {
      id: 6,
      name: 'Lucas Petit',
      initials: 'LP',
      rating: 4,
      text: 'Très satisfait de mes achats. Les produits bio sont de qualité et les prix restent raisonnables. Je recommande !',
      date: 'Il y a 1 mois',
      verified: true
    }
  ];
}