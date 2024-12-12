import { Injectable } from '@angular/core';
import { BUSINESS_CATEGORY } from '../../constants/url.constants';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessCategoryService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  create(formdata: any): Observable<any> {
    return this.http.post(`${BUSINESS_CATEGORY}/create`, formdata).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAll(): Observable<any> {
    return this.http.get(`${BUSINESS_CATEGORY}/get-all`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAllArchived(): Observable<any> {
    return this.http.get(`${BUSINESS_CATEGORY}/get-all-archived`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${BUSINESS_CATEGORY}/get-by-id/${id}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  update(id: string, formData: any): Observable<any> {
    return this.http.patch(`${BUSINESS_CATEGORY}/update/${id}`, formData).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  activate(id: string): Observable<any> {
    return this.http.patch(`${BUSINESS_CATEGORY}/activate/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  deactivate(id: string): Observable<any> {
    return this.http.patch(`${BUSINESS_CATEGORY}/deactivate/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  archive(id: string): Observable<any> {
    return this.http.patch(`${BUSINESS_CATEGORY}/archive/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  restore(id: string): Observable<any> {
    return this.http.patch(`${BUSINESS_CATEGORY}/restore/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${BUSINESS_CATEGORY}/delete/${id}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }
}

