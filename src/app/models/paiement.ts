export class Paiement {
   id!: number;
  commande_id!: number;
  statut!: 'PAYEE' | 'NON_PAYEE';
mode_paiement!: 'EN_LIGNE' | 'EN_ESPECE';
  montant_paye!: number;
  date_paiement!: string;
  reference_transaction?: string;
  created_at!: string;
  updated_at!: string;
}
