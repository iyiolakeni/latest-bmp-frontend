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
    branchId: string = '',
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc'
  ): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId)
    .set('page', page)
    .set('limit', limit)
    .set('sortBy', sortBy)
    .set('sortDirection', sortDirection);
    return this.http.get(`${DEPLOYED_TABLE}/get-all`, {params}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getAllRequestByAssignedTo(
    assignedTo: string = '',
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc'
  ): Observable<any>{
    let params = new HttpParams()
    .set('assignedTo', assignedTo)
    .set('page', page)
    .set('limit', limit)
    .set('sortBy', sortBy)
    .set('sortDirection', sortDirection);
    return this.http.get(`${DEPLOYED_TABLE}/get-all-request-by-assigned-to`, {params}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  getDeployedRequest(branchId: string): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId);
    return this.http.get(`${DEPLOYED_TABLE}/get-all-deployed-request/${branchId}`, {params}).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getPendinRequest(branchId: string): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId);
    return this.http.get(`${DEPLOYED_TABLE}/get-all-pending-request/${branchId}`, {params}).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getDeliveredRequest(branchId: string): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId);
    return this.http.get(`${DEPLOYED_TABLE}/get-all-delivered-request/${branchId}`, {params}).pipe(
       catchError(this.errorHandler.errorHandler)
    )
  }

  getDeployedRequestAssignedTo(assignedTo: string): Observable<any>{
    let params = new HttpParams()
    .set('assignedTo', assignedTo);
    return this.http.get(`${DEPLOYED_TABLE}/get-deployed-request-assigned-to/${assignedTo}`, {params}).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getDeliveredRequestBy(deliveredBy: string): Observable<any>{
    let params = new HttpParams()
    .set('deliveredBy', deliveredBy);
    return this.http.get(`${DEPLOYED_TABLE}/get-all-delivered-request/${deliveredBy}`, {params}).pipe(
       catchError(this.errorHandler.errorHandler)
    )
  }

  deployRequest(id: string, formData: any): Observable<any>{
    return this.http.patch(`${DEPLOYED_TABLE}/approve-status/${id}`, formData).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  deliverRequest(id: string, formData: any): Observable<any>{
    return this.http.patch(`${DEPLOYED_TABLE}/delivery-status/${id}`, formData).pipe(
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
