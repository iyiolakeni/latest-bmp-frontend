import { Injectable } from '@angular/core';
import { MODEL } from '../../constants/url.constants';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  create(formdata: any): Observable<any> {
    return this.http.post(`${MODEL}/create`, formdata).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAll(): Observable<any> {
    return this.http.get(`${MODEL}/get-all`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAllArchived(): Observable<any> {
    return this.http.get(`${MODEL}/get-all-archived`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${MODEL}/get-by-id/${id}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  update(id: string, formData: any): Observable<any> {
    return this.http.patch(`${MODEL}/update/${id}`, formData).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  activate(id: string): Observable<any> {
    return this.http.patch(`${MODEL}/activate/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  deactivate(id: string): Observable<any> {
    return this.http.patch(`${MODEL}/deactivate/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  archive(id: string): Observable<any> {
    return this.http.patch(`${MODEL}/archive/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  restore(id: string): Observable<any> {
    return this.http.patch(`${MODEL}/restore/${id}`, {}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${MODEL}/delete/${id}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }
}
