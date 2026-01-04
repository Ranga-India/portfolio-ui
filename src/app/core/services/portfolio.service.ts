import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/portfolios`;

  // Helper to add the Auth Token to requests
  private getHeaders(): Observable<HttpHeaders> {
    return from(this.auth.getAccessToken()).pipe(
      switchMap(token => {
        // We send the 'sub' (User ID) via token, but for now our Backend 
        // logic purely relies on the validated token or header.
        // NOTE: In a real app, you put the token in 'Authorization: Bearer '
        // and the backend decodes it. 
        // For our setup, we will send the User ID in a custom header 
        // IF we aren't decoding on backend, but let's stick to standard Bearer auth.
        
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
          
          // *CRITICAL FIX*: Our current FastAPI backend looks for 'x-user-id' header
          // because we skipped the full JWT validation logic for speed.
          // We need to extract the user ID from the Auth Service.
          const user = this.auth.getCurrentUserValue();
          if (user?.id) {
            headers = headers.set('x-user-id', user.id);
          }
        }
        return [headers]; // Return as observable value
      })
    );
  }

  getMyPortfolios(): Observable<any[]> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<any[]>(this.apiUrl, { headers }))
    );
  }

  createPortfolio(data: any): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post<any>(this.apiUrl, data, { headers }))
    );
  }

  // Add this to PortfolioService
updatePortfolio(id: number, data: any): Observable<any> {
  return this.getHeaders().pipe(
    switchMap(headers => this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers }))
  );
}

// No headers needed for this one!
getPublicPortfolio(slug: string): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/portfolios/public/${slug}`);
}

}