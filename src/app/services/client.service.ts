import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://127.0.0.1:8000/api/clients';
  
    constructor(private http: HttpClient) {}
  
    getAll(): Observable<Client[]> {
      return this.http.get<Client[]>(this.apiUrl);
    }
  
    getById(id: number): Observable<Client> {
      return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }
  
    addClient(client: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, client);
    }
  
    updateClient(id: number, client: Client): Observable<Client> {
      return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
    }
  
    deleteClient(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
