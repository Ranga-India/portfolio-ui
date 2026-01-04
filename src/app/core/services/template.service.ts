import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/templates`;

  // Fetch all templates, optionally filter by profession
  getTemplates(profession?: string): Observable<any[]> {
    let url = this.apiUrl;
    if (profession) {
      url += `?profession=${profession}`;
    }
    return this.http.get<any[]>(url);
  }

  getTemplateById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}