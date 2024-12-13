import { Injectable } from '@angular/core';
import { DEPLOYED_TABLE } from '../../constants/url.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeployedTableService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc'
  ): Observable<any>{
    let params = new HttpParams()
    .set('page', page)
    .set('limit', limit)
    .set('sortBy', sortBy)
    .set('sortDirection', sortDirection);
    return this.http.get(`${DEPLOYED_TABLE}/get-all`, {params}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getDeployedRequest(): Observable<any>{
    return this.http.get(`${DEPLOYED_TABLE}/get-all-deployed-request`).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getPendinRequest(): Observable<any>{
    return this.http.get(`${DEPLOYED_TABLE}/get-all-pending-request`).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getDeliveredRequest(): Observable<any>{
    return this.http.get(`${DEPLOYED_TABLE}/get-all-delivered-request`).pipe(
       catchError(this.errorHandler.errorHandler)
    )
  }

  deployRequest(id: string, formData: any): Observable<any>{
    return this.http.put(`${DEPLOYED_TABLE}/approve-status/${id}`, formData).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  deliverRequest(id: string, formData: any): Observable<any>{
    return this.http.put(`${DEPLOYED_TABLE}/delivery-status/${id}`, formData).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getRequestById(id: string): Observable<any>{
    return this.http.get(`${DEPLOYED_TABLE}/get-one/${id}`).pipe(
      catchError(
        this.errorHandler.errorHandler)
      )
  }

}
