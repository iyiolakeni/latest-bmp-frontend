import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { catchError, Observable } from 'rxjs';
import { REQUESTS } from '../../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(
    private http: HttpClient,
    private errorHanlder: ErrorHandlerService
  ) { }

  create(request: any): Observable<any>{
    return this.http.post<any>(`${REQUESTS}/create`, request).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }

  getAll(): Observable<any>{
    return this.http.get(`${REQUESTS}/get-all`).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }

  getById(id: string): Observable<any>{
    return this.http.get(`${REQUESTS}/get-by-id/${id}`).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }

  getRequestsByUser(userId: string): Observable<any>{
    return this.http.get(`${REQUESTS}/get-by-user/${userId}`).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }

  getPendingRequests(userId: string): Observable<any>{
    return  this.http.get(`${REQUESTS}/get-pending-request-by-user/${userId}`).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }
  getApprovedRequest(userId: string): Observable<any>{
    return  this.http.get(`${REQUESTS}/get-approved-request-by-user/${userId}`).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }
  getRejectedRequests(userId: string): Observable<any>{
    return  this.http.get(`${REQUESTS}/get-rejected-request-by-user/${userId}`).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }
  getDeployedRequests(userId: string): Observable<any>{
    return  this.http.get(`${REQUESTS}/get-deployed-request-by-user/${userId}`).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }
  getDeliveredRequests(userId: string): Observable<any>{
    return  this.http.get(`${REQUESTS}/get-delivered-request-by-user/${userId}`).pipe(
      catchError(this.errorHanlder.errorHandler)
    )
  }

}