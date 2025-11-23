import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../models/admin';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/administrateurs';

  constructor(private http: HttpClient) { }
  getAll(): Observable<Admin[]> {
      return this.http.get<Admin[]>(this.apiUrl);
    }
  
    getById(id: number): Observable<Admin> {
      return this.http.get<Admin>(`${this.apiUrl}/${id}`);
    }
  
    addAdmin(admin: Admin): Observable<Admin> {
      return this.http.post<Admin>(this.apiUrl, admin);
    }
  
    updateAdmin(id: number, admin: Admin): Observable<Admin> {
      return this.http.put<Admin>(`${this.apiUrl}/${id}`, admin);
    }
  
    deleteAdmin(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
