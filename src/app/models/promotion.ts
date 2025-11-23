import { type } from "node:os";
import { Produit } from "./produit";

export interface Promotion {
  id: number;
  nom: string;
  code: string;
  description?: string;
  reduction: number;
  dateDebut: string;
  dateFin: string;
  seuilMinimum?: number;
  utilisationMax?: number;
  usage?: number;
  estActif: boolean;
  type_id: number;
  typePromo: TypePromotion;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  produits?: any[];
}
export type TypePromotion = 'PRODUIT' | 'COMMANDE';
/*export interface PromotionProduit {
  id: number;
  promo_id: number;
  produit_id: number;
  montant_reduction?: number;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  promotion?: Promotion;
  produit?: Produit;
}*/

