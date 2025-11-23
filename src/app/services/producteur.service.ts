import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Producteur } from '../models/producteur';

/*export interface Producteur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  ninea: string;
  description: string;
  telephone: string;
  adresse: string;
  entreprise: string;
  specialite: string;
  utilisateur: User;
}*/

@Injectable({
  providedIn: 'root'
})
export class ProducteurService {
  private apiUrl = 'http://127.0.0.1:8000/api/producteurs';
  private api = 'http://127.0.0.1:8000/api/addProducteur';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producteur[]> {
    return this.http.get<Producteur[]>(this.apiUrl);
  }

  getById(id: number): Observable<Producteur> {
    return this.http.get<Producteur>(`${this.apiUrl}/${id}`);
  }

  addProducteur(producteur: Producteur): Observable<Producteur> {
    return this.http.post<Producteur>(this.api, producteur);
  }

  updateProducteur(id: number, producteur: Producteur): Observable<Producteur> {
    return this.http.put<Producteur>(`${this.apiUrl}/${id}`, producteur);
  }

  deleteProducteur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
