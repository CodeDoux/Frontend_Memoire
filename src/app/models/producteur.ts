import { User } from "./user";
import { Produit } from "./produit";
export class Producteur {
    id!: number;
    entreprise! : string;
    description! : string;
    ninea! : string;
    emailPro! : string;
    telPro! : string;


utilisateur!: User;
produits?: any[];

}
