import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Codelist } from '../models/codelist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodelistService {

  
  private readonly URL = "http://127.0.0.1:8000/api/codelist";
  
    constructor(
      private httpClient: HttpClient,
      private authService: AuthService
    ) { }
  
    // CORRECTION: L'interceptor gère automatiquement les headers
    getAll(): Observable<Codelist[]> {
      return this.httpClient.get<Codelist[]>(this.URL);
    }
    getValueByType(typeValue: string): Observable<Codelist[]> {
  return this.httpClient.get<Codelist[]>(`${this.URL}/type/${typeValue}`);
}
  
    addCodeList(codelist: Codelist): Observable<Codelist> {
      return this.httpClient.post<Codelist>(this.URL, codelist);
    }
  
    updateCodeList(codelist: Codelist, id: number): Observable<Codelist> {
      return this.httpClient.put<Codelist>(`${this.URL}/${id}`, codelist);
    }
  
    deleteCodeList(id: number): Observable<any> {
      return this.httpClient.delete(`${this.URL}/${id}`);
    }
  
    getById(id: number): Observable<Codelist> {
      return this.httpClient.get<Codelist>(`${this.URL}/${id}`);
    }
  
    // Méthodes utilitaires pour vérifier les permissions
    canManageCodeList(): boolean {
      return this.authService.hasRole('ADMIN') || this.authService.hasRole('PRO');
    }
  
    canViewCodeList(): boolean {
      return this.authService.isAuthenticated();
    }
}
