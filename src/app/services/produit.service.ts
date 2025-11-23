import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produit } from '../models/produit';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
private readonly URL = "http://127.0.0.1:8000/api";
  private readonly ADMIN_URL = `${this.URL}/produits`;
  private readonly CLIENT_URL = `${this.URL}/produitsClient`;
  private readonly PRODUCTEUR_URL = `${this.URL}/produitsProducteur`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private readonly API_URL = 'http://127.0.0.1:8000/api';

  /**
   * 🟢 Récupérer tous les produits (ADMIN)
   */
  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.API_URL}/produits`);
  }

  /**
   * 🟠 Récupérer les produits du producteur connecté
   */
  getAllByProducteur(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.API_URL}/produitsProducteur`);
  }

  /**
   * 🟣 Récupérer les produits visibles par les clients
   */
  getAllForClient(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.API_URL}/produitsClient`);
  }

  /**
   * 🔍 Récupérer un produit par son ID
   */
  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.API_URL}/produits/${id}`);
  }

  /**
   * 🧾 Ajouter un produit (ADMIN ou PRODUCTEUR)
   * Utilise FormData pour gérer les images
   */
  addProduit(produit: FormData): Observable<any> {
    //const formData = this.buildFormData(produit, images);
    return this.http.post(`${this.API_URL}/produits`, produit);
  }

  /**
   * ✏️ Mettre à jour un produit
   */
  updateProduit(id: number, produit: FormData): Observable<any> {
    //const formData = this.buildFormData(produit, images);
    return this.http.post(`${this.API_URL}/produits/${id}?_method=PUT`, produit);
  }

  /**
   * ❌ Supprimer un produit
   */
  deleteProduit(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/produits/${id}`);
  }

  /**
   * 🔄 Changer le statut de validation (ADMIN)
   */
  updateValidation(id: number, validation: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE'): Observable<any> {
    return this.http.patch(`${this.API_URL}/produits/${id}/validation`, { validationAdmin: validation });
  }

  /**
   * récuperation des statistiques
   */

  getStats() {
  return this.http.get<any>(`${this.API_URL}/produits/stats`);
}
  /**
   * ⚙️ Construire le FormData (utile pour upload d’images)
   */
  private buildFormData(produit: Produit, images?: File[]): FormData {
    const formData = new FormData();

    // Champs texte et numériques
    Object.entries(produit).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'images') {
        formData.append(key, value.toString());
      }
    });

    // Gestion des fichiers (images)
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images[]', image);
      });
    }

    return formData;
  }

  /**
   * 📊 Récupérer les statistiques de stock (ADMIN)
   */
  getStockStatistics(): Observable<any> {
    return this.http.get(`${this.API_URL}/produits/stock-statistics`);
  }

  /**
   * ♻️ Réapprovisionner un produit (ADMIN/PRO)
   */
  restockProduit(id: number, quantite: number): Observable<any> {
    return this.http.post(`${this.API_URL}/produits/${id}/restock`, { quantite });
  }

  /**
   * 🔔 Récupérer les produits en attente de validation (ADMIN)
   */
  getProduitsEnAttente(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.API_URL}/produits-en-attente`);
  }
}