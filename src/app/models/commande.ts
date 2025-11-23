import { CommandeProduit } from "./commande-produit";
import { Livraison } from "./livraison";
import { Paiement } from "./paiement";
import { Produit } from "./produit";
import { User } from "./user";

export type StatutCommande = "EN_PREPARATION" | "PRETE" | "EN_LIVRAISON" | "LIVREE" | "ANNULEE";

export class Commande {
   id!: number;
  client_id!: number;
  montant_total!: number;
  statut!: StatutCommande;
  created_at!: Date;
  updated_at!: Date;

  // Relations
  ligneCommande!: LigneCommande[] | LigneCommande;
  user?: User;                    // client associé
  client?: User;                  // alias pour user
  produit_commander?: CommandeProduit[]; // produits commandés avec quantités
  produits?: Produit[];           // produits de la commande
  paiement?: Paiement;            // paiement lié
  livraison?: Livraison;
}

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
