import { Categorie } from "./categorie";
import { Promotion } from "./promotion";

export class Produit {
    id!: number;
    nom!: string;
    description!: string;
    stock!: number;
    prix!: number;
    note!: number;
    saison!: string;
    poids!: string;
    categorie_id!: number;

    // Relation
    categorie?: Categorie;
    promotions?: Promotion[];

    // Tableau d'images
    images!: string[];
}
