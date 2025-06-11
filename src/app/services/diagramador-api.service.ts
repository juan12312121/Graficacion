import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiagramadorApiService {
  private apiUrl = `${environment.apiUrl}/diagramas`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Asegúrate de tenerlo almacenado al hacer login
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  guardar(diagrama: any) {
    return this.http.post(this.apiUrl, diagrama, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerTodos() {
    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }
}
