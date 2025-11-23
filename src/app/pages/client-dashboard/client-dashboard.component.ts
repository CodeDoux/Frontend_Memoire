import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PanierService } from '../../services/panier.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent {
  nombreProduitsPanier: number = 0;
  currentPromoIndex: number = 0;
  cartCount: number = 0;

  // Promotions qui défilent
  promotions: string[] = [
    '🎉 Promotion : -20% sur tous les légumes bio cette semaine !',
    '🔥 Nouveau : Pain artisanal frais disponible tous les jours !',
    '✨ Livraison gratuite dès 30€ d\'achat !',
    '🌟 Découvrez nos nouveaux producteurs locaux !'
  ];

  nouveautes = [
    { id: 1, emoji: '🍅', category: 'Légumes', title: 'Tomates Bio', producer: 'Ferme du Soleil', price: '2,50€', unit: '/kg', badge: 'Nouveau' },
    { id: 2, emoji: '🥖', category: 'Boulangerie', title: 'Pain de Campagne', producer: 'Boulangerie Martin', price: '3,20€', unit: '/pièce', badge: 'Nouveau' },
    { id: 3, emoji: '🥛', category: 'Produits Laitiers', title: 'Lait Fermier', producer: 'Ferme Dubois', price: '1,80€', unit: '/litre', badge: 'Nouveau' },
    { id: 4, emoji: '🍯', category: 'Épicerie', title: 'Miel de Fleurs', producer: 'Rucher des Collines', price: '8,50€', unit: '/pot', badge: 'Nouveau' }
  ];
   goToCart(): void {
    alert('Redirection vers le panier...');
    // this.router.navigate(['/panier']);
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
   loadCartCount(): void {
    // Récupérer depuis le localStorage ou votre service
    const cart = localStorage.getItem('cart');
    if (cart) {
      const cartItems = JSON.parse(cart);
      this.cartCount = cartItems.length;
    }
  }
  
  constructor(
    private panierService: PanierService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // S'abonner aux changements du panier
    this.panierService.getNombreProduits().subscribe(nombre => {
      this.nombreProduitsPanier = nombre;
    });
    this.loadCartCount();
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
