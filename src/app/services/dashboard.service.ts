import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly URL = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) { }

  getStats() {
  return this.http.get<any>(`${this.URL}/dashboard/stats`);
}
}
