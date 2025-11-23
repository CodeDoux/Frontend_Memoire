import { Categorie } from "./categorie";
import { Producteur } from "./producteur";
import { Promotion } from "./promotion";

export class Produit {
    id!: number;
  nom!: string;
  description!: string;
  stock!: number;
  prix!: number;
  prixPromo?: number | null;
  saison?: string | null;
  seuilAlerteStock!: number;
  poids?: string | null;
  dateAjout?: Date; // ou Date si tu veux le parser
  statut!: StatutProduit;
  validationAdmin!: ValidationAdmin;
  note?: number;
  categorie_id!: number;
  producteur_id!: number;
  categorie?: Categorie; // optionnel : si tu charges la relation
  producteur?: Producteur; // idem
  images!: ImageProduit[]; // si tu gères les images
  createdAt!: Date;
  updatedAt!: Date;
    // Nouvelles propriétés pour la gestion des stocks
  stock_status?: 'critique' | 'faible' | 'moyen' | 'bon';
  stock_alert_message?: string;
  need_restocking?: boolean;
}
/**
 * Statut de disponibilité du produit
 */
export type StatutProduit = 'DISPONIBLE' | 'EN_RUPTURE';

/**
 * Statut de validation par l'administrateur
 */
export type ValidationAdmin = 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
/**
 * Interface pour les images liées au produit
 */
export interface ImageProduit {
  id?: number;
  chemin: string;
  isPrimary?: boolean;
  altText?: string;
  dateCreation?: Date;
}

  
  