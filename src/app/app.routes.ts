import { Routes } from '@angular/router';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { ProduitComponent } from './pages/produit/produit.component';
import { AddCategorieComponent } from './pages/categorie/addCategorie.component';
import { AddProduitComponent } from './pages/produit/addProduit.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { CommandeComponent } from './pages/commande/commande.component';
import { PanierComponent } from './pages/panier/panier.component';
import { ValiderCommandeComponent } from './pages/valider-commande/valider-commande.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { UserComponent } from './pages/user/user.component';
import { AddUserComponent } from './pages/user/addUser.component';
import { LivraisonComponent } from './pages/livraison/livraison.component';
import { PaiementComponent } from './pages/paiement/paiement.component';
import { ChatComponent } from './pages/chat/chat.component';
import { CommandeClientComponent } from './pages/commande/commandeclient.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ProducteurDashboardComponent } from './pages/producteur-dashboard/producteur-dashboard.component';
import { ProducteurComponent } from './pages/producteur/producteur.component';
import { AddProducteurComponent } from './pages/producteur/addProducteur.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AddAdminComponent } from './pages/admin/addAdmin.component';
import { CodeListComponent } from './pages/code-list/code-list.component';
import { AddCodeListComponent } from './pages/code-list/addcode-list.component';
import { ClientComponent } from './pages/client/client.component';
import { AddClientComponent } from './pages/client/addClient.component';
import { AccueilProducteurDashboardComponent } from './pages/producteur-dashboard/accueilproducteur-dashboard.component';
import { AccueilAdminDashboardComponent } from './pages/admin-dashboard/accueilAdmin-dashboard.component';
import { ProduitAdminComponent } from './pages/produit/produitAdmin.component';
import { CommandeAdminComponent } from './pages/commande/commandeAdmin.component';
/*import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
*/
export const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' }, // AJOUT: Route par défaut
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'catalogue', component: CatalogueComponent},
  { path: 'panier', component: PanierComponent },
  
  { path: 'dashboardClient', component: ClientDashboardComponent,
    children: [
      { path: 'catalogue', component: CatalogueComponent },
     // { path: 'commande', component: CommandeComponent },
      { path: 'mes-commandes', component: CommandeClientComponent },
     // { path: 'panier', component: PanierComponent },
      { path: 'validerCommande', component: ValiderCommandeComponent },
      //{ path: 'chats', component: ChatComponent, },  
      { path: '', redirectTo: 'catalogue', pathMatch: 'full' }
    ]
  },

  // Routes pour ADMIN
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'acceuil', component: AccueilComponent },
      { path: 'acceuilAdmin', component: AccueilAdminDashboardComponent },
      { path: 'addProducteur', component: AddProducteurComponent},
      { path: 'codelist', component: CodeListComponent },
      { path: 'client', component: ClientComponent },
      { path: 'addClient', component: AddClientComponent },
      { path: 'addCodelist', component: AddCodeListComponent },
      { path: 'administrateur', component: AdminComponent },
      { path: 'addAdmin', component: AddAdminComponent },
      { path: 'updateAdmin/:id', component: AddAdminComponent, },
      { path: 'utilisateur', component: UserComponent},
      { path: 'addUser', component: AddUserComponent, },
      { path: 'updateUser/:id', component: AddUserComponent, },
      { path: 'categorie', component: CategorieComponent},
      { path: 'addCategorie', component: AddCategorieComponent,  },
      { path: 'updateCategorie/:id', component: AddCategorieComponent,},
      { path: 'produit', component: ProduitAdminComponent, },
      { path: 'addProduit', component: AddProduitComponent,},
      { path: 'updateProduit/:id', component: AddProduitComponent,},
      { path: 'commandes', component: CommandeAdminComponent },
      { path: 'promotion', component: PromotionComponent },
      { path: 'producteur', component: ProducteurComponent},
      
      { path: 'updatePro/:id', component: AddProducteurComponent, },
      { path: 'livraison', component: LivraisonComponent, },
      { path: 'paiements', component: PaiementComponent, },
      { path: 'chats', component: ChatComponent, },
      { path: '', redirectTo: 'acceuilAdmin', pathMatch: 'full' }
    ]
  },

  // Routes pour CLIENT
  {
    path: 'client',
    component: ClientDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENT'] },
    children: [
      { path: 'acceuil', component: AccueilComponent },
      //{ path: 'catalogue', component: CatalogueComponent },
      { path: 'commande', component: CommandeComponent },
      { path: 'mes-commandes', component: CommandeClientComponent },
      
      { path: 'validerCommande', component: ValiderCommandeComponent },
      { path: 'chats', component: ChatComponent, },  
      { path: '', redirectTo: 'accueil', pathMatch: 'full' }
    ]
  },

  // Routes pour PRODUCTEUR
  {
    path: 'producteur',
    component: ProducteurDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PRO'] },
    children: [
      { path: 'accueilProducteur', component: AccueilProducteurDashboardComponent },
      { path: 'acceuil', component: AccueilComponent },
      { path: 'utilisateur', component: UserComponent},
      { path: 'produit', component: ProduitComponent, },
      { path: 'promotion', component: PromotionComponent },
      { path: 'addProduit', component: AddProduitComponent,},
      { path: 'updateProduit/:id', component: AddProduitComponent,},
      { path: '', redirectTo: 'accueilProducteur', pathMatch: 'full' }
    ]
  },

  // AJOUT: Page d'erreur pour accès non autorisé
  { 
    path: 'unauthorized', 
    component: UnauthorizedComponent 
  },
  
  // AJOUT: Route wildcard pour les 404
  { path: '**', redirectTo: '/login' }
];