import { Injectable } from '@angular/core';
import { ACCOUNTS } from '../../constants/url.constants';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  create(formdata: any): Observable<any> {
    return this.http.post(`${ACCOUNTS}/create`, formdata).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAll(): Observable<any> {
    return this.http.get(`${ACCOUNTS}/get-all`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAllArchived(): Observable<any> {
    return this.http.get(`${ACCOUNTS}/get-all-archived`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${ACCOUNTS}/get-by-id/${id}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  update(id: string, formData: any): Observable<any> {
    return this.http.patch(`${ACCOUNTS}/update/${id}`, formData).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  activate(id: string): Observable<any> {
    return this.http.patch(`${ACCOUNTS}/activate/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  deactivate(id: string): Observable<any> {
    return this.http.patch(`${ACCOUNTS}/deactivate/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  archive(id: string): Observable<any> {
    return this.http.patch(`${ACCOUNTS}/archive/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  restore(id: string): Observable<any> {
    return this.http.patch(`${ACCOUNTS}/restore/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${ACCOUNTS}/delete/${id}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }
}
