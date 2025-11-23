import { User } from "./user";

export class Client {
  id!: number;
  user_id?: number;
  adresseLivraison_id?: number | null;
  adresseFacturation_id?: number | null;

  // Relations
  user!: User;
  adresseLivraison?: Adresse | null;
  adresseFacturation?: Adresse | null;

  created_at?: string;
  updated_at?: string;
}

export interface Adresse {
  id?: number;
  rue?: string;
  ville?: string;
  quartier?: string;
  codePostal?: string;
}
