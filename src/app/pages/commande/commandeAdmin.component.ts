import { Component, HostListener, OnInit } from '@angular/core';
import { Commande } from '../../models/commande';
import { CommandesService } from '../../services/commandes.service';
import { AuthService } from '../../services/auth.service';
import { ProduitService } from '../../services/produit.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Promotion } from '../../models/promotion';
import { PromotionService } from '../../services/promotion.service';
import jsPDF from 'jspdf';
declare var bootstrap: any;
import autoTable from 'jspdf-autotable';
import { Produit } from '../../models/produit';


interface LigneCommande{
  id: number;
  prix: number;
  quantite: number;
  montantLigne: number;
  reduction: number;
  produit_id: number;
  commande_id: number;

  produit: Produit;
  commande:Commande;
}

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, 
    
  ],
  templateUrl: './commandeAdmin.component.html',
  styleUrl: './commandeAdmin.component.css'
})
export class CommandeAdminComponent implements OnInit{
   stats = {
  pending: 0,
  processing: 0,
  delivery: 0,
  completed: 0
};

  allOrders: Commande[] = [];
  filteredOrders: Commande[] = [];
  paginatedOrders: Commande[] = [];

  // Filters
  searchQuery: string = '';
  filterStatus: string = '';
  filterPayment: string = '';
  filterDate: string = '';
  sortBy: string = 'recent';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 15;
  totalPages: number = 1;

  // Modal
  showDetailsModal: boolean = false;
  selectedOrder: Commande | null = null;
  highlightedOrderId: number | null = null;
  activeMenuOrderId: number | null = null;
  commandes: Commande[]=[];

toggleStatusMenu(orderId: number): void {
  if (this.activeMenuOrderId === orderId) {
    this.activeMenuOrderId = null;
  } else {
    this.activeMenuOrderId = orderId;
  }
}

// Fermer le menu au clic en dehors
@HostListener('document:click', ['$event'])
clickOutside(event: Event): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-container')) {
    this.activeMenuOrderId = null;
  }
}

  constructor(private router: Router, private commandeService: CommandesService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadOrderStats();
  }

  loadOrderStats(): void {
  this.commandeService.getOrderStats().subscribe({
    next: data => {
      this.stats = data;
      console.log("Statistiques commandes :", data);
    },
    error: err => {
      console.error("Erreur stats commandes :", err);
    }
  });
}

  loadOrders(): void {
    // Charger les commandes depuis l'API
    // this.adminService.getOrders().subscribe(...)
    
    // Données de test
    this.getMockOrders();
    this.filteredOrders = [...this.allOrders];
    this.updatePagination();
  }

  getMockOrders(){
        this.commandeService.getAll().subscribe(
          (data : Commande[])=>{
            this.allOrders = data;
            console.log(this.allOrders);
            //this.commandesFiltrees = [...this.commandes]; 
            console.log(data);
          },
          (error)=>{
            console.log(error);
          }
        )
      }

  
  filterOrders(): void {
    let filtered = [...this.allOrders];

    if (this.searchQuery) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(this.searchQuery) ||
        order.client?.nomComplet.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.client?.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(order => order.statut === this.filterStatus);
    }

    if (this.filterPayment) {
      filtered = filtered.filter(order => order.paiement?.statut === this.filterPayment);
    }

    if (this.filterDate) {
      const filterDate = new Date(this.filterDate);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === filterDate.toDateString();
      });
    }

    this.filteredOrders = filtered;
    this.currentPage = 1;
    this.sortOrders();
  }

  sortOrders(): void {
    switch(this.sortBy) {
      case 'recent':
        this.filteredOrders.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        this.filteredOrders.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'amount-desc':
        this.filteredOrders.sort((a, b) => b.montant_total - a.montant_total);
        break;
      case 'amount-asc':
        this.filteredOrders.sort((a, b) => a.montant_total - b.montant_total);
        break;
    }
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
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

  viewOrderDetails(order: Commande): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(order: Commande, newStatus: string): void {
    if (confirm(`Changer le statut de la commande #${order.id} vers "${this.getStatusLabel(newStatus)}" ?`)) {
      // Appeler l'API
      console.log('Update status:', order.id, newStatus);
      //order.statut = newStatus;
      this.highlightedOrderId = order.id;
      setTimeout(() => this.highlightedOrderId = null, 2000);
    }
  }

  printOrder(order: Commande): void {
    console.log('Print order:', order.id);
    window.print();
  }

  contactClient(order: Commande): void {
    window.location.href = `mailto:${order.client?.email}?subject=Commande #${order.id}`;
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  exportOrders(): void {
    console.log('Export orders');
    // Implémenter l'export CSV/Excel
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRMEE': 'Confirmée',
      'EN_PREPARATION': 'En préparation',
      'EN_LIVRAISON': 'En livraison',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
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

  getImageUrl(chemin?: string): string {
    if (!chemin) return 'assets/images/placeholder.jpg';
    return `ttp://localhost:8000/storage/${chemin}`;
  }

  getLignes(cmd: Commande) {
  const lignes = cmd?.ligneCommande;

  if (!lignes) return [];

  // Si c'est déjà un tableau
  if (Array.isArray(lignes)) {
    return lignes;
  }

  // Sinon on convertit l'objet en tableau
  return [lignes];
}

  calculateSubtotal(order: Commande): number {
  if (!Array.isArray(order.ligneCommande)) {
    const item = order.ligneCommande;
    return item ? (item.montantLigne ?? item.prix * item.quantite) : 0;
  }

  return order.ligneCommande.reduce(
    (sum: number, item: any) =>
      sum + (item.sousTotal ?? item.prixUnitaire * item.quantite),
    0
  );
}
 
}
      