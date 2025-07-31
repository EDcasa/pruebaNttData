import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(this.baseUrl);
  }

  getById(id: string): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(`${this.baseUrl}/${id}`);
  }

  create(product: Product): Observable<any> {
    return this.http.post(this.baseUrl, product);
  }

  update(id: string, product: Omit<Product, 'id'>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, product);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  checkIdExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }
}
