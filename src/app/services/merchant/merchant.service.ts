import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { MERCHANTS } from '../../constants/url.constants';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  create(formdata: any): Observable<any> {
    return this.http.post(`${MERCHANTS}/create`, formdata).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAll(): Observable<any> {
    return this.http.get(`${MERCHANTS}/get-all`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAllArchived(): Observable<any> {
    return this.http.get(`${MERCHANTS}/get-all-archived`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${MERCHANTS}/get-by-id/${id}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  update(id: string, formData: any): Observable<any> {
    return this.http.patch(`${MERCHANTS}/update/${id}`, formData).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  activate(id: string): Observable<any> {
    return this.http.patch(`${MERCHANTS}/activate/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  deactivate(id: string): Observable<any> {
    return this.http.patch(`${MERCHANTS}/deactivate/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  archive(id: string): Observable<any> {
    return this.http.patch(`${MERCHANTS}/archive/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  restore(id: string): Observable<any> {
    return this.http.patch(`${MERCHANTS}/restore/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${MERCHANTS}/delete/${id}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }
}
